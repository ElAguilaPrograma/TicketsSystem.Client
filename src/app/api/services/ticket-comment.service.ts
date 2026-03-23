import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "../../env/enviroment";
import { ITicketsReadComment } from "../interfaces/ticket-comment/ITicketsReadComment";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class TicketCommentService {
    private readonly apiUrl = `${environment.apiUrl}/TicketComments`;
    private http = inject(HttpClient);
    private router = inject(Router);

    public getTicketComments(ticketId: string): Observable<ITicketsReadComment[]> {
        return this.http.get<ITicketsReadComment[]>(`${this.apiUrl}/getticketscomment/${ticketId}`, { withCredentials: true });
    }

    public createTicketComment(ticketId: string, content: string, isInternal: boolean): Observable<void> {
        const body = { content, isInternal };
        return this.http.post<void>(`${this.apiUrl}/createticketcomment/${ticketId}`, body, { withCredentials: true });
    }
}