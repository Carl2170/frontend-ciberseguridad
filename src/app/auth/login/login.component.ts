import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    HttpClientModule
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
  errorMessage: string | null = null; // Variable para almacenar mensajes de error del backend
  passwordType: string = 'password';
  
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
    this.errorMessage = null; // Limpiamos el mensaje de error al enviar el formulario
    if (!this.otpSent) {
      this.loginWithCredentials();
    } else {
      this.verifyOtp();
    }
  }

  loginWithCredentials() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.loginWithOtp({ email, password }).subscribe({
        next: response => {
          console.log(response.message);
          this.otpSent = true;
          this.emailForOtp = email;
        },
        error: err => {
          console.error('Error al iniciar sesión:', err);
          // Mostramos el mensaje de error del backend
          this.errorMessage = err.error?.message || 'Error desconocido';
        }
      });
    }
  }

  verifyOtp() {
    if (this.otpForm.valid) {
      const { otpCode } = this.otpForm.value;
      this.authService.verifyOtpAndLogin({ email: this.emailForOtp, otpCode }).subscribe({
        next: response => {
          console.log('Login exitoso!', response);
          // TODO: Guardar los tokens en el almacenamiento local
          this.router.navigate(['/dashboard']);
        },
        error: err => {
          console.error('Error de verificación OTP:', err);
          // Mostramos el mensaje de error del backend
          this.errorMessage = err.error?.message || 'Error desconocido';
        }
      });
    }
  }

    togglePasswordVisibility(): void {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
  }
  navigateToRegister() {
    this.router.navigate(['/auth/register']);
  }
}
