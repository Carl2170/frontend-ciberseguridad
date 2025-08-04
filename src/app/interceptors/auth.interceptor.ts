import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Interceptor que añade el token de autenticación a las solicitudes HTTP salientes.
 * Lee el token del AuthService y lo incluye en el encabezado 'Authorization'.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const authToken = authService.getAccessToken();

  // Si el token existe, clona la solicitud y añade el encabezado de autorización
  if (authToken) {
    console.log('Token de autenticación encontrado:', authToken);
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`)
    });
    return next(authReq);
  }

  // Si no hay token, continúa con la solicitud original y registra el evento
  console.log('No se encontró un token de autenticación. Solicitud sin token.');
  return next(req);
};
