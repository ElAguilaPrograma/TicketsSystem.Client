import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../api/services/authentication.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authenticationService = inject(AuthenticationService);

  const authReq = req.clone({
    withCredentials: true
  });

  const isAuthEndpoint = req.url.includes('/Authentication/');

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !isAuthEndpoint) {
        authenticationService.logout();
        router.navigate(['/home']);
      }
      return throwError(() => error);
    })
  );
};