import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgIf, CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    HttpClientModule,
    CommonModule
  ],
  providers: [
    AuthService
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  otpForm!: FormGroup;
  otpSent: boolean = false;
  emailForOtp: string = '';
  errorMessage: string | null = null;
  
  // Variable para controlar el tipo del input de la contraseña
  passwordType: string = 'password';

  // Variables para controlar los estados de carga
  isSendingOtp: boolean = false;
  isVerifyingOtp: boolean = false;
  isValidatingFields: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.otpForm = this.fb.group({
      otpCode: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  onSubmit() {
    this.errorMessage = null;
    if (!this.otpSent) {
      this.loginWithCredentials();
    } else {
      this.verifyOtp();
    }
  }

loginWithCredentials() {
  if (this.loginForm.valid) {
    this.isValidatingFields = true; // ← Empieza validación de campos (simulada)
    this.errorMessage = null;

    // Simulamos validación antes del envío real del OTP (500 ms)
    setTimeout(() => {
      this.isValidatingFields = false;
      this.isSendingOtp = true;
      const { email, password } = this.loginForm.value;

      this.authService.loginWithOtp({ email, password }).pipe(
        catchError(err => {
          this.isSendingOtp = false;
          console.error('Error al iniciar sesión:', err);
          this.errorMessage = err.error?.message || 'Error desconocido';
          return of(null);
        })
      ).subscribe(response => {
        this.isSendingOtp = false;
        if (response) {
          console.log(response.message);
          this.otpSent = true;
          this.emailForOtp = email;
        }
      });
    }, 500);
  } else {
    this.errorMessage = 'Por favor completa los campos correctamente.';
  }
}


 verifyOtp() {
    if (this.otpForm.valid) {
      this.isVerifyingOtp = true; // Empieza el estado de carga para la verificación del OTP
      const { otpCode } = this.otpForm.value;
      this.authService.verifyOtpAndLogin({ email: this.emailForOtp, otpCode }).pipe(
        catchError(err => {
          this.isVerifyingOtp = false; // Finaliza el estado de carga en caso de error
          console.error('Error de verificación OTP:', err);
          this.errorMessage = err.error?.message || 'Código OTP inválido o expirado.';
          return of(null);
        })
      ).subscribe(response => {
        this.isVerifyingOtp = false; // Finaliza el estado de carga al recibir la respuesta
        if (response) {
          console.log('Login exitoso!', response);
          // Los tokens se guardan dentro del servicio por el tap()
          
          // Espera un momento antes de navegar para asegurar que el token se guarde
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 100);
        }
      });
    }
  }
  
  /**
   * Alterna el tipo del input de la contraseña para mostrar/ocultar el texto.
   */
  togglePasswordVisibility(): void {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
  }

  navigateToRegister() {
    this.router.navigate(['/auth/register']);
  }
}
