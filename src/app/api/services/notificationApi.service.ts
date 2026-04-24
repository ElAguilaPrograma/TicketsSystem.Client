import { inject, Injectable } from "@angular/core";
import { INotificationRead } from "../interfaces/notifications/INotificationRead";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../env/enviroment";

@Injectable({
    providedIn: 'root'
})
export class NotificationApiService {
    private http = inject(HttpClient);
    private readonly apiUrl = environment.apiUrl;

    public getNotifications(userId: string): Observable<INotificationRead> {
        return this.http.get<INotificationRead>(`${this.apiUrl}/notifications/getusernotifications/${userId}`, { withCredentials: true });
    }

    public toogleNotificationReadStatus(notificationId: string): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/notifications/tooglenotificationreadstatus/${notificationId}`, { withCredentials: true });
    }
    
}