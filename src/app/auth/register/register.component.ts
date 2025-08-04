import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

/**
 * Validador personalizado para comprobar si las contraseñas coinciden.
 */
export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  
  // Si ambos campos existen y tienen valor, los comparamos.
  if (password && confirmPassword && password.value !== confirmPassword.value) {
    // Si no coinciden, devolvemos un error a nivel del grupo del formulario.
    return { passwordsDoNotMatch: true };
  }
  
  return null;
};

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    NgIf,
    HttpClientModule
  ],
  providers: [
    AuthService
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null; // Variable para almacenar el mensaje de registro exitoso
  passwordType: string = 'password';
  confirmPasswordType: string = 'password';

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordMatchValidator });
  }

  onRegister() {
    this.errorMessage = null;
    this.successMessage = null; // Limpiamos el mensaje de éxito
    if (this.registerForm.valid) {
      const { name, email, password } = this.registerForm.value;
      this.authService.register({ name, email, password }).subscribe({
        next: response => {
          console.log('Registro exitoso!', response);
          this.successMessage = 'Registro exitoso. Serás redirigido al login en 3 segundos.';
          // Redirige al login después de 3 segundos.
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 3000);
        },
        error: err => {
          console.error('Error al registrar:', err);
          this.errorMessage = err.error?.message || 'Error desconocido al registrar';
        }
      });
    }
  }

  /**
   * Alterna el tipo del input de la contraseña principal para mostrar/ocultar el texto.
   */
  togglePasswordVisibility(): void {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
  }

  /**
   * Alterna el tipo del input de la confirmación de contraseña para mostrar/ocultar el texto.
   */
  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordType = this.confirmPasswordType === 'password' ? 'text' : 'password';
  }

  navigateToLogin() {
    this.router.navigate(['/auth/login']);
  }
}
