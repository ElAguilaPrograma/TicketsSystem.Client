import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
    providedIn: "root"
})
export class AuthService{
    router = inject(Router);

    isLoggedIn(): boolean {
        return localStorage.getItem('token') != null;
    }

    login(): void {
        localStorage.setItem('token', "tokensimuladoXD");
    }

    logout(): void {
        localStorage.removeItem('token');
        this.router.navigate(['/home']);
    }
}