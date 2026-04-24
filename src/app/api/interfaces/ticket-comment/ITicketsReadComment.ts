export interface ITicketsReadComment {
    commentId: string,
    ticketId: string,
    userId: string,
    content: string,
    isInternal: boolean,
    createdByUser: string,
    createdAt: string
}