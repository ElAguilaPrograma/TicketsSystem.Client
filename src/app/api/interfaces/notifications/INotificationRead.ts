export interface INotificationRead {
    notificationId: string;
    userId: string;
    type: string;
    message: string;
    isRead: boolean;
    createdAt: Date;
}