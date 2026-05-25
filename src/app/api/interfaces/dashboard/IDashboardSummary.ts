export interface IDashboardSummary {
    totalTickets: number;
    openTickets: number;
    inProgressTickets: number;
    closedTickets: number;
    resolvedToday: number;
    avgResolutionHours: number;
    ticketsByPriority: Record<string, number>;
    ticketsByStatus: Record<string, number>;
    recentTickets: IDashboardRecentTicket[];
}

export interface IDashboardRecentTicket {
    ticketId: string;
    title: string;
    createdByUser: string;
    priorityName?: string | null;
    statusName?: string | null;
    createdAt: string;
}
