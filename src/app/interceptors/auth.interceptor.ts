import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  let authReq = req;

  if (token) {
    authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // ✅ EXCLUSIÓN: No dispares las alertas automáticas de 401/403 si el usuario está en login o en reclamaciones
      if (!router.url.includes('/login') && !router.url.includes('/libro-reclamaciones')) {

        if (error.status === 401) {
          authService.logout();
          Swal.fire({
            title: 'Sesión Expirada',
            text: 'Tu sesión ha terminado. Por favor, ingresa de nuevo.',
            icon: 'info',
            confirmButtonText: 'Ir al Login'
          }).then(() => router.navigate(['/login']));
        }
        else if (error.status === 403) {
          Swal.fire({
            title: 'Acceso Denegado',
            text: 'No tienes permisos para realizar esta acción o ver este recurso.',
            icon: 'error',
            confirmButtonColor: '#dc3545',
            confirmButtonText: 'Entendido'
          });
        }
      }
      // El error se sigue propagando para que el componente lo maneje de forma personalizada si lo requiere
      return throwError(() => error);
    })
  );
};
