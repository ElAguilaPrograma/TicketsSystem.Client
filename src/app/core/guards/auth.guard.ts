import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthenticationService } from "../../api/services/authentication.service";
import { map } from "rxjs";

export const authGuard: CanActivateFn = () => {
    const authService = inject(AuthenticationService);
    const router = inject(Router);

    if (authService.isLoggedIn()) {
        return true;
    }

    return authService.checkStatus$().pipe(
        map(user => user !== null ? true : router.parseUrl('/login'))
    );
};