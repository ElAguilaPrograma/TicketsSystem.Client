import { inject } from "@angular/core";
import { CanActivateFn } from "@angular/router";
import { AuthenticationService } from "../../api/services/authentication.service";
import { Router } from "@angular/router";


export const authGuard: CanActivateFn = (route, state) => {
    const authenticationService = inject(AuthenticationService);
    const router = inject(Router);

    if (authenticationService.isLoggedIn()) {
        return true;
    }

    return router.parseUrl('/login');
}