import { computed, inject, Injectable, signal } from "@angular/core";
import { ILogin } from "../interfaces/ILogin";
import { environment } from "../../env/enviroment";
import { HttpClient } from "@angular/common/http";
import { catchError, of, switchMap, tap } from "rxjs";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    private readonly apiUrlAuth = `${environment.apiUrl}/Authentication`;
    private http = inject(HttpClient);
    private router = inject(Router);

    private currentUser = signal<any | null>(null);

    readonly isLoggedIn = computed(() => this.currentUser() !== null);
    readonly userRole = computed(() => this.currentUser()?.role ?? '');

    login(credentials: ILogin) {
        return this.http.post<any>(`${this.apiUrlAuth}/login`, credentials, { withCredentials: true }).pipe(
            tap((res) => console.log(res)),
            switchMap(() => this.checkStatus$())
        );
    }

    checkStatus$() {
        return this.http.get<any>(`${this.apiUrlAuth}/getcurrentuser`, { withCredentials: true }).pipe(
            tap(user => this.currentUser.set(user)),
            catchError(() => {
                this.currentUser.set(null);
                return of(null);
            })
        );
    }

    logout() {
        this.http.post(`${this.apiUrlAuth}/logout`, {}, { withCredentials: true })
            .subscribe({ error: () => { } });
        this.currentUser.set(null);
        this.router.navigate(['/home']);
    }
}