export interface IReadTickets {
    ticketId: string;
    title: string;
    description: string;
    statusId: number;
    statusName?: string | null;
    priorityId: number;
    priorityName?: string | null;
    assignedToUserId?: string | null;
    assignedToUser?: string | null;
    createdByUser?: string | null;
    createdByUserId?: string | null;
    createdAt: string;
    updatedAt?: string | null;
    closedAt?: string | null;
}