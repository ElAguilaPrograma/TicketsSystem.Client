import { computed, inject, Injectable, signal } from "@angular/core";
import { ILogin } from "../interfaces/user/ILogin";
import { environment } from "../../env/enviroment";
import { HttpClient } from "@angular/common/http";
import { catchError, of, switchMap, tap } from "rxjs";
import { Router } from "@angular/router";
import { ICurrentUserInfo } from "../interfaces/user/ICurrentUserInfo";
import { SignalRService } from "./signalR.service";

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    private readonly apiUrlAuth = `${environment.apiUrl}/Authentication`;
    private http = inject(HttpClient);
    private router = inject(Router);
    private signalRService = inject(SignalRService);

    private currentUser = signal<ICurrentUserInfo | null>(null);

    readonly isLoggedIn = computed(() => this.currentUser() !== null);
    readonly userRole = computed(() => this.currentUser()?.role ?? '');

    login(credentials: ILogin) {
        return this.http.post<ICurrentUserInfo>(`${this.apiUrlAuth}/login`, credentials, { withCredentials: true }).pipe(
            switchMap(() => this.checkStatus$())
        );
    }

    checkStatus$() {
        return this.http.get<ICurrentUserInfo>(`${this.apiUrlAuth}/getcurrentuser`, { withCredentials: true }).pipe(
            tap(user => {
                this.currentUser.set(user);
                if (user) {
                    this.signalRService.startConnection();
                }
            }),
            catchError(() => {
                this.currentUser.set(null);
                this.signalRService.stopConnection();
                return of(null);
            })
        );
    }

    getCurrentUserRole() {
        return this.currentUser()?.role;
    }

    getCurrentUserId() {
        return this.currentUser()?.userId;
    }

    getCurrentUserInfo() {
        return this.currentUser();
    }

    uploadProfilePic(profilePic: File, userId: string) {
        const formData = new FormData();
        if (profilePic instanceof Blob) {
            formData.append('file', profilePic, profilePic.name);
        }
        return this.http.put(`${this.apiUrlAuth}/uploadprofilepic/${userId}`, formData, { withCredentials: true });
    }

    removeProfilePic(userId: string) {
        return this.http.delete(`${this.apiUrlAuth}/removeprofilepic/${userId}`, { withCredentials: true });
    }

    logout() {
        this.http.post(`${this.apiUrlAuth}/logout`, {}, { withCredentials: true })
            .subscribe({ 
                next: () => this.signalRService.stopConnection(),
                error: () => this.signalRService.stopConnection() 
            });
        this.currentUser.set(null);
        this.router.navigate(['/home']);
    }
}
