import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service'; // Importamos el AuthService
import { environment } from '../environments/environment'; // Asegúrate de importar el entorno correcto

/**
 * Define la estructura de los datos de monitoreo esperados,
 * basándose en la tabla `security_events`.
 */
export interface MonitoringData {
  id: string;
  event_type: string;
  ip_address: string;
  user_agent: string;
  payload: string;
  path: string;
  is_blocked: boolean;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class MonitoringService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService // Inyectamos el AuthService
  ) { }

  /**
   * Obtiene todos los datos de monitoreo del backend,
   * enviando el token de autenticación directamente.
   * Ahora espera un array de objetos de monitoreo.
   * @returns Un Observable que emite los datos recibidos de la API.
   */
  getData(): Observable<MonitoringData[]> {
    const authToken = this.authService.getAccessToken();

    // Si no hay token, lanzamos un error inmediatamente
    if (!authToken) {
      return throwError(() => new Error('No se encontró un token de autenticación.'));
    }

    // Creamos los encabezados con el token de forma manual
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });

    // Enviamos la petición con los encabezados
    return this.http.get<MonitoringData[]>(`${this.apiUrl}/monitoring/data`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Maneja errores HTTP.
   * @param error El objeto de error de la respuesta HTTP.
   * @returns Un Observable con el error.
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ha ocurrido un error desconocido.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Código del error: ${error.status}, mensaje: ${error.error.message || error.statusText}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
