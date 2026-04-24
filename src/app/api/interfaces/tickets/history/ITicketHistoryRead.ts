export interface ITicketHistoryRead {
    ticketId: string;
    changedByUserId: string;
    changeGroupId: string;
    fieldName: string;
    oldValue: string | null;
    newValue: string | null;
    changedAt: Date;
}
