import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Comprueba si el usuario está logueado
  if (authService.isLoggedIn()) {
    return true; // Permite el acceso a la ruta
  } else {
    // Redirige al usuario al login si no está autenticado
    router.navigate(['/auth/login']);
    return false; // Bloquea el acceso a la ruta
  }
};
