import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment'; // Asegúrate de importar el entorno correcto
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Envía las credenciales al backend para iniciar el proceso de login con OTP.
   * El backend verificará el email y la contraseña, y enviará un código OTP al correo.
   * @param credentials - Objeto con email y password.
   */
  loginWithOtp(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials);
  }

  /**
   * Envía el código OTP para verificar el login.
   * Si el OTP es válido, el backend devolverá los tokens de autenticación.
   * @param verificationData - Objeto con email y otpCode.
   */
  verifyOtpAndLogin(verificationData: { email: string, otpCode: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/verify-otp`, verificationData);
  }
  
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }
}
