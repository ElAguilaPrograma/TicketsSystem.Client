export interface IUpdateTicket {
    title: string;
    description: string;
    statusId: number;
    priorityId: number;
    assignedToUserId: string | null;
}