import { ITicketHistoryRead } from "./ITicketHistoryRead";

export interface ITicketHistoryGroup {
    changeGroupId: string;
    changedAt: Date;
    changedByUserId: string;
    changedByUserFullName: string;
    changes: ITicketHistoryRead[];
}
