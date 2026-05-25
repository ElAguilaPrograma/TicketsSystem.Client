import { inject, Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../env/enviroment";
import { IDashboardSummary } from "../interfaces/dashboard/IDashboardSummary";

export interface IDashboardFilters {
    currentUserOnly?: boolean;
    assignedToMeOnly?: boolean;
    fromDate?: string;
    toDate?: string;
    recentTicketsTake?: number;
}

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    private readonly apiUrl = `${environment.apiUrl}/Tickets`;
    private http = inject(HttpClient);

    public getDashboardSummary(filters: IDashboardFilters = {}): Observable<IDashboardSummary> {
        let params = new HttpParams();

        if (filters.currentUserOnly != null)
            params = params.set('currentUserOnly', filters.currentUserOnly);
        if (filters.assignedToMeOnly != null)
            params = params.set('assignedToMeOnly', filters.assignedToMeOnly);
        if (filters.fromDate)
            params = params.set('fromDate', filters.fromDate);
        if (filters.toDate)
            params = params.set('toDate', filters.toDate);
        if (filters.recentTicketsTake != null)
            params = params.set('recentTicketsTake', filters.recentTicketsTake);

        return this.http.get<IDashboardSummary>(`${this.apiUrl}/dashboard`, { params, withCredentials: true });
    }
}
