import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { ToastService } from "../services/toast.service";
import { catchError, tap } from "rxjs";

export const apiSuccessInterceptor: HttpInterceptorFn = (req, next) => {
    const toastService = inject(ToastService);
return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        const serverMessage = (event.body as any)?.message;
        switch (event.status) {
          case 201:
            toastService.success(
                'Success',
                serverMessage ?? 'Resource created successfully',
            );
            break;
          case 202:
            toastService.success(
                'Success',
                serverMessage ?? 'Resource accepted successfully',
            );
            break;
          case 204:
            toastService.success(
                'Success',
                serverMessage ?? 'Resource deleted successfully',
            );
            break;
          case 200:
            if (req.method !== 'GET'){
              console.log('Successful operation' + req.url + req.body);
                toastService.success(
                    'Success',
                    serverMessage ?? 'Operation successful'
                );
            }
            break;
        }
      }
    })
    )
}