export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastData {
  id: string;
  type: ToastType;
  title: string;
  subtitle?: string;
  message: string;
  duration?: number;       // ms, default 5000. Pass 0 to keep until dismissed.
  dismissible?: boolean;   // default true
}
