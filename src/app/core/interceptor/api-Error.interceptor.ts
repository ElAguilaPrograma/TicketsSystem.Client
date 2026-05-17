import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";
import { ToastService } from "../services/toast.service";

export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const toastService = inject(ToastService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = "An unexpected error occurred.";

            if (error.error) {
                if (typeof error.error === 'string') {
                    errorMessage = error.error;
                } else if (error.error.message) {
                    errorMessage = error.error.message;
                } else if (error.error.errors) {
                    errorMessage = Object.values(error.error.errors).flat().join(', ');
                }
            }
            
            switch (error.status) {
                case 400:
                    toastService.error(
                        'Invalid application',
                        errorMessage,
                        'Bad Request'
                    );
                    break;
                case 401:
                    toastService.warning(
                        'Invalid or expired session.',
                        'Please, log in',
                        'Unauthorized'
                    );
                    router.navigate(['/unauthorized']);
                    break;
                case 403:
                    toastService.warning(
                        'Access denied',
                        'You do not have permission to perform this action.' + errorMessage,
                        'Forbidden'
                    );
                    router.navigate(['/forbidden']);
                    break;
                case 404:
                    toastService.info(
                        'Not found',
                        'The requested resource does not exist.',
                        'Not Found'
                    );
                    break;
                case 500:
                    toastService.error(
                        'Server error',
                        'Something went wrong, please try again later.',
                        'Internal Server Error'
                    );
                    break;
                case 413:
                    toastService.warning(
                        'File too large',
                        errorMessage,
                        'Payload Too Large'
                    );
                    break;
                case 415:
                    toastService.warning(
                        'Unsupported media type',
                        errorMessage,
                        'Unsupported Media Type'
                    );
                    break;
                default:
                    toastService.error(
                        'Unexpected error',
                        'Something went wrong, please try again.',
                        `Error ${error.status}`
                    );
            }
            return throwError(() => error);
        })
    );
}