import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';


@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
 forgotForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotForm.invalid) {
      return;
    }

    // Simular llamada al backend para enviar email
    const email = this.forgotForm.value.email;

    this.successMessage = `Se ha enviado un enlace de recuperación a ${email}`;
    this.errorMessage = null;

    // Si quieres limpiar el formulario luego del envío:
    this.forgotForm.reset();
  }
}
