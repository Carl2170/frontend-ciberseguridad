import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // Mantiene la configuración de detección de cambios
    provideZoneChangeDetection({ eventCoalescing: true }), 
    
    provideRouter(routes),
    
    // Registra el HttpClient y le añade el interceptor de autenticación
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};
