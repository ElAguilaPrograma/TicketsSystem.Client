import { CanActivateFn } from "@angular/router";
import { inject } from "@angular/core";
import { AuthenticationService } from "../../api/services/authentication.service";
import { Router } from "@angular/router";

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
    return () => {
        const authService = inject(AuthenticationService);
        const router = inject(Router);
        const userRole = authService.getCurrentUserRole();
        if (userRole && allowedRoles.includes(userRole)) {
            return true;
        }
        router.navigate(['/forbidden']);
        return false;
    }
}