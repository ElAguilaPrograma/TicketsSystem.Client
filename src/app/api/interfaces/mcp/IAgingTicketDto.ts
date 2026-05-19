export interface IAgingTicketDto {
    ticketId: string;
    title: string;
    status: string;
    priority: string;
    createdAt: string;
    daysOpen: number;
    assignedTo: string | null;
}
