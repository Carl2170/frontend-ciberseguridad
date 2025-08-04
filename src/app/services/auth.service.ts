import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment'; // Asegúrate de importar el entorno correcto
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private accessToken = 'authToken';
  private refreshToken = 'refreshToken';

  constructor(private http: HttpClient) {}

  loginWithOtp(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials);
  }

  public verifyOtpAndLogin(verificationData: { email: string, otpCode: string }): Observable<{ accessToken: string, refreshToken: string }> {
    return this.http.post<{ accessToken: string, refreshToken: string }>(`${this.apiUrl}/auth/verify-otp`, verificationData).pipe(
     tap(response => {
        if (response && response.accessToken && response.refreshToken) {
          this.saveAccessToken(response.accessToken);
          this.saveRefreshToken(response.refreshToken);
        }
      })
    );
  }
  
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }

  private saveAccessToken(token: string): void {
    localStorage.setItem(this.accessToken, token);
  }

  public getAccessToken(): string | null {
    return localStorage.getItem(this.accessToken);
  }

  public logout(): void {
    localStorage.removeItem(this.accessToken);
    localStorage.removeItem(this.refreshToken);
  }

  private saveRefreshToken(token: string): void {
    localStorage.setItem(this.refreshToken, token);
  }

  public getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshToken);
  }
  
  public isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }
}
