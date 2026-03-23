import { inject, Injectable } from "@angular/core";
import { environment } from "../../env/enviroment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Router } from "@angular/router";
import { ICurrentUserTicketsCount } from "../interfaces/tickets/ICurrentUserTicketsCount";
import { Observable } from "rxjs";
import { IPagedResult } from "../interfaces/IPagedResult";
import { IReadTickets } from "../interfaces/tickets/IReadTickets";
import { IUpdateTicket } from "../interfaces/tickets/IUpdateTicket";
import { ICreateTicket } from "../interfaces/tickets/ICreateTicket";

@Injectable({
    providedIn: 'root'
})
export class TicketService {
    private readonly apiUrl = `${environment.apiUrl}/Tickets`;
    private http = inject(HttpClient);
    private router = inject(Router);

    constructor() { }

    public getCurrentUserTicketsCount(): Observable<ICurrentUserTicketsCount> {
        return this.http.get<ICurrentUserTicketsCount>(`${this.apiUrl}/getcurrentuserticketscount`, { withCredentials: true });
    }

    public getTickets(
        page: number = 1,
        pageSize: number = 5,
        userId: string | null = null,
        currentUserOnly: boolean = true,
        status: string = "All",
        priority: string = "All",
        month: number | null = null,
        year: number | null = null,
        querySearch: string = ""): Observable<IPagedResult<IReadTickets>> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('pageSize', pageSize.toString())
            .set('currentUserOnly', currentUserOnly)
            .set('status', status)
            .set('priority', priority)
            .set('querySearch', querySearch);

        if (userId) params = params.set('userId', userId);
        if (month != null) params = params.set('month', month);
        if (year != null) params = params.set('year', year);

        return this.http.get<IPagedResult<IReadTickets>>(`${this.apiUrl}/gettickets`, { params, withCredentials: true });
    }

    public getTicketById(ticketId: string): Observable<IReadTickets> {
        return this.http.get<IReadTickets>(`${this.apiUrl}/getticketbyid/${ticketId}`, { withCredentials: true });
    }

    public resolveATicket(ticketId: string): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/closetickets/${ticketId}`, { withCredentials: true });
    }

    public reopenATicket(ticketId: string): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/reopentickets/${ticketId}`, { withCredentials: true });
    }

    public createATicket(ticketData: ICreateTicket): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/createticket`, ticketData, { withCredentials: true });
    }

    public updateTicket(ticketData: IUpdateTicket, ticketId: string): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/updateticketinfo/${ticketId}`, ticketData, { withCredentials: true });
    }
}