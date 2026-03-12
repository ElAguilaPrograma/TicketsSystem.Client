import { Injectable, inject } from "@angular/core";
import { environment } from "../../env/enviroment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { IUser } from "../interfaces/IUser";
import { IPagedResult } from "../interfaces/IPagedResult";
import { Observable } from "rxjs";
import { IUserCount } from "../interfaces/IUserCount";

@Injectable({
    providedIn: 'root'
})
export class UserAdminService {
    private readonly apiUrl = `${environment.apiUrl}/Authentication`;
    private http = inject(HttpClient);

    getUsers(page: number = 1, pageSize: number = 5, role: string = "All Roles", isActive: string = "All", querySearch: string = ""): Observable<IPagedResult<IUser>> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('pageSize', pageSize.toString())
            .set('role', role)
            .set('isActive', isActive)
            .set('querySearch', querySearch);
        return this.http.get<IPagedResult<IUser>>(`${this.apiUrl}/getallusers`, { params, withCredentials: true });
    }

    activateAndDeactivateUsers(userId: string) {
        return this.http.post(`${this.apiUrl}/deactivateauser/${userId}`, { withCredentials: true });
    }

    getUsersCount() {
        return this.http.get<IUserCount>(`${this.apiUrl}/getuserscount`, { withCredentials: true });
    }
}