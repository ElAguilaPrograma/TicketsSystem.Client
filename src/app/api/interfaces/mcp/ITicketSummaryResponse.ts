import { ISimilarTicket } from "./ISimilarTicket";

export interface ITicketSummaryResponse {
    ticketId: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    createdBy: string;
    assignedTo: string | null;
    createdAt: string;
    commentsCount: number;
    attachmentsCount: number;
    aiSummary: string;
    proposedSolutions: string[];
    similarTickets: ISimilarTicket[];
}
