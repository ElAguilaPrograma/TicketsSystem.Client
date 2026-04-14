export type NotificationType = 'critical' | 'high' | 'update' | 'info';

export interface NotificationData {
  id: string;
  type: NotificationType;
  title: string;
  subtitle?: string;
  message: string;
  duration?: number;       // ms – defaults vary by type
  dismissible?: boolean;   // default true
  route?: string;          // click navigates here
  exiting?: boolean;       // internal – true while click-out animation plays
}
