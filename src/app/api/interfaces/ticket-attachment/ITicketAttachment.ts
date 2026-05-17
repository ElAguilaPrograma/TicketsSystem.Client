export interface ITicketAttachment {
    ticketAttachmentId: string;
    fileName: string;
    fileUrl?: string | null;
    filePath: string;
    createdAt: string;
}