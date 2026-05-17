import { inject, Injectable } from "@angular/core";
import { environment } from "../../env/enviroment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { ICurrentUserTicketsCount } from "../interfaces/tickets/ICurrentUserTicketsCount";
import { Observable } from "rxjs";
import { IPagedResult } from "../interfaces/IPagedResult";
import { IReadTickets } from "../interfaces/tickets/IReadTickets";
import { IUpdateTicket } from "../interfaces/tickets/IUpdateTicket";
import { ITicketHistoryGroup } from "../interfaces/tickets/history/ITicketHistoryGroup";

@Injectable({
    providedIn: 'root'
})
export class TicketService {
    private readonly apiUrl = `${environment.apiUrl}/Tickets`;
    private http = inject(HttpClient);

    constructor() { }

    public getCurrentUserTicketsCount(): Observable<ICurrentUserTicketsCount> {
        return this.http.get<ICurrentUserTicketsCount>(`${this.apiUrl}/getcurrentuserticketscount`, { withCredentials: true });
    }

    public getTodaysTicketsCount(): Observable<number> {
        return this.http.get<number>(`${this.apiUrl}/gettodayscount`, { withCredentials: true });
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
        querySearch: string = "",
        hasAssignment: boolean | null = null,
        assignedToMeOnly: boolean = false): Observable<IPagedResult<IReadTickets>> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('pageSize', pageSize.toString())
            .set('currentUserOnly', currentUserOnly)
            .set('assignedToMeOnly', assignedToMeOnly)
            .set('status', status)
            .set('priority', priority)
            .set('querySearch', querySearch);

        if (userId) params = params.set('userId', userId);
        if (month != null) params = params.set('month', month);
        if (year != null) params = params.set('year', year);
        if (hasAssignment != null) params = params.set('hasAssignment', hasAssignment);

        return this.http.get<IPagedResult<IReadTickets>>(`${this.apiUrl}/gettickets`, { params, withCredentials: true });
    }

    public exportTickets(
        userId: string | null = null,
        currentUserOnly: boolean = true,
        status: string = "All",
        priority: string = "All",
        month: number | null = null,
        year: number | null = null,
        querySearch: string = "",
        hasAssignment: boolean | null = null,
        assignedToMeOnly: boolean = false,
        timezoneOffsetMinutes: number = new Date().getTimezoneOffset()): Observable<Blob> {
        let params = new HttpParams()
            .set('currentUserOnly', currentUserOnly)
            .set('assignedToMeOnly', assignedToMeOnly)
            .set('status', status)
            .set('priority', priority)
            .set('querySearch', querySearch)
            .set('timezoneOffsetMinutes', timezoneOffsetMinutes.toString());

        if (userId) params = params.set('userId', userId);
        if (month != null) params = params.set('month', month);
        if (year != null) params = params.set('year', year);
        if (hasAssignment != null) params = params.set('hasAssignment', hasAssignment);

        return this.http.get(`${this.apiUrl}/exporttickets`, { params, responseType: 'blob', withCredentials: true });
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

    public createATicket(ticketData: FormData): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/createticket`, ticketData, { withCredentials: true });
    }

    public updateTicket(ticketData: IUpdateTicket, ticketId: string): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/updateticketinfo/${ticketId}`, ticketData, { withCredentials: true });
    }

    public updateTicketUser(ticketData: IUpdateTicket, ticketId: string): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/updateticketuser/${ticketId}`, ticketData, { withCredentials: true });
    }

    public assignTicketToMe(ticketId: string): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/accepttickets/${ticketId}`, { withCredentials: true });
    }

    public abandonTicket(ticketId: string): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/abandonticket/${ticketId}`, { withCredentials: true });
    }

    public getTicketHistory(ticketId: string): Observable<ITicketHistoryGroup[]> {
        return this.http.get<ITicketHistoryGroup[]>(`${environment.apiUrl}/TicketHistory/gettickethistory/${ticketId}`, { withCredentials: true });
    }
}