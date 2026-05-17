import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../env/enviroment";
import { ITicketAttachment } from "../interfaces/ticket-attachment/ITicketAttachment";

@Injectable({
    providedIn: 'root'
})
export class TicketAttachmentService {
    private readonly apiUrl = `${environment.apiUrl}/TicketAttachments`;
    private http = inject(HttpClient);

    getAttachmentsForTicket(ticketId: string) {
        return this.http.get<ITicketAttachment[]>(`${this.apiUrl}/getattachments/${ticketId}`, { withCredentials: true });
    }

    addAttachment(ticketId: string | null, file: File) {
        return this.http.post(`${this.apiUrl}/addattachment/${ticketId}`, file, { withCredentials: true });
    }

    deleteAttachment(ticketId: string, attachmentId: string) {
        return this.http.delete(`${this.apiUrl}/deleteattachment/${ticketId}/${attachmentId}`, { withCredentials: true });
    }
}