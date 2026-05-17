import { inject, Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../env/enviroment";
import { StorageBucket } from "../../core/enums/storage_bucket";

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    private readonly apiUrl = `${environment.apiUrl}/Storage`;
    private http = inject(HttpClient);

    getUrlForProfilePic(bucketName: StorageBucket, path: string) {
        return this.getFileUrl(bucketName, path);
    }

    getFileUrl(bucketName: StorageBucket, path: string) {
        const params = new HttpParams()
            .set('bucketName', bucketName.toString())
            .set('path', path);

        return this.http.get<{ url: string }>(`${this.apiUrl}/getfileurl`, { params, withCredentials: true });
    }
}