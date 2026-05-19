import { IAgingTicketDto } from "./IAgingTicketDto";
import { IRecurringPatternDto } from "./IRecurringPatternDto";

export interface IAiInsightsResponse {
    agingTickets: IAgingTicketDto[];
    recurringPatterns: IRecurringPatternDto[];
    aiAnalysis: string;
}
