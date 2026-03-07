import { inject, Injectable, signal } from "@angular/core";
import { ILogin } from "../interfaces/ILogin";
import { environment } from "../../env/enviroment";
import { HttpClient } from "@angular/common/http";
import { switchMap, tap } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    private readonly apiUrlAuth = `${environment.apiUrl}/Authentication`;
    private http = inject(HttpClient);
    private currentUser = signal<any | null>(null);

    login(credentials: ILogin) {
        return this.http.post<any>(`${this.apiUrlAuth}/login`, credentials, {
            withCredentials: true
        }).pipe(
            tap(user => this.currentUser.set(user))
        );
    }

    isLoggedIn(): boolean {
        return this.currentUser() !== null;
    }

    checkStatus() {
        this.http.get(`${environment.apiUrl}/authentication/getcurrentuser`, { withCredentials: true })
            .subscribe({
                next: (user) => this.currentUser.set(user),
                error: () => this.currentUser.set(null)
            });
    }

    getUserRole(): string {
        return this.currentUser()?.role || '';
    }

    logout() {
        this.currentUser.set(null);
    }
}