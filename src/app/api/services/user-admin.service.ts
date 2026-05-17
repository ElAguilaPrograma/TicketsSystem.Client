import { Injectable, inject } from "@angular/core";
import { environment } from "../../env/enviroment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { IUser } from "../interfaces/user/IUser";
import { IPagedResult } from "../interfaces/IPagedResult";
import { Observable } from "rxjs";
import { IUserCount } from "../interfaces/user/IUserCount";
import { ICreateUser } from "../interfaces/user/ICreateUser";
import { IUpdateUser } from "../interfaces/user/IUpdateUser";
import { form } from "@angular/forms/signals";
import { StorageBucket } from "../../core/enums/storage_bucket";

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

    createUser(user: ICreateUser) {
        const formData = new FormData();

        formData.append('fullName', user.fullName);
        formData.append('email', user.email);
        formData.append('role', user.role);
        formData.append('isActive', String(user.isActive));
        formData.append('password', user.password);
        formData.append('confirmPassword', user.password);

        if (user.profilePic) {
            if (user.profilePic instanceof Blob) {
                formData.append('profilePic', user.profilePic, user.profilePic.name);
            }
        }

        return this.http.post(`${this.apiUrl}/createuser`, formData, { withCredentials: true });
    }

    updateUser(user: IUpdateUser, userId: string) {
        return this.http.put(`${this.apiUrl}/updateuser/${userId}`, user, { withCredentials: true });
    }

    updateUserProfilePic(profilePic: File | null, userId: string) {
        const formData = new FormData();
        if (profilePic) {
            if (profilePic instanceof Blob) {
                formData.append('profilePic', profilePic, profilePic.name);
            }
        }
        return this.http.put(`${this.apiUrl}/uploadprofilepic/${userId}`, formData, { withCredentials: true });
    }

    getUserById(userId: string) {
        return this.http.get<IUser>(`${this.apiUrl}/getuserbyid/${userId}`, { withCredentials: true });
    }

    getUserProfilePicUrl(userId: string) {
        return this.http.get<{ url: string }>(`${this.apiUrl}/getprofilepic/${userId}`, { withCredentials: true });
    }

    exportUsers(role: string = "All Roles", isActive: string = "All", timezoneOffsetMinutes: number): Observable<Blob> {
        const params = new HttpParams()
            .set('role', role)
            .set('isActive', isActive)
            .set('timezoneOffsetMinutes', timezoneOffsetMinutes.toString());
        return this.http.get(`${this.apiUrl}/exportusers`, { params, responseType: 'blob', withCredentials: true });
    }

    activateAndDeactivateUsers(userId: string) {
        return this.http.post(`${this.apiUrl}/deactivateauser/${userId}`, { withCredentials: true });
    }

    getUsersCount() {
        return this.http.get<IUserCount>(`${this.apiUrl}/getuserscount`, { withCredentials: true });
    }
}