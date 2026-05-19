import { inject, Injectable } from "@angular/core";
import { environment } from "../../env/enviroment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ITicketSummaryResponse } from "../interfaces/mcp/ITicketSummaryResponse";
import { IAiInsightsResponse } from "../interfaces/mcp/IAiInsightsResponse";

@Injectable({
    providedIn: 'root'
})
export class McpService {
    private readonly apiUrl = `${environment.apiUrl}/Mcp`;
    private http = inject(HttpClient);

    public getSummaryFromTicket(ticketId: string): Observable<ITicketSummaryResponse> {
        return this.http.get<ITicketSummaryResponse>(`${this.apiUrl}/get-summary-from-ticket/${ticketId}`, { withCredentials: true });
    }

    public getAiInsights(): Observable<IAiInsightsResponse> {
        return this.http.get<IAiInsightsResponse>(`${this.apiUrl}/get-ai-insights`, { withCredentials: true });
    }
}
