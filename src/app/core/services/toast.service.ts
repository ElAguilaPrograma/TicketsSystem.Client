import { Injectable, signal } from '@angular/core';
import { ToastData, ToastType } from '../../shared/components/toast/toast.types';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  /** Reactive list of active toasts */
  toasts = signal<ToastData[]>([]);

  private _timers = new Map<string, ReturnType<typeof setTimeout>>();

  /**
   * Show a toast notification.
   * Returns the generated toast id so it can be dismissed programmatically.
   */
  show(config: Omit<ToastData, 'id'>): string {
    const id = crypto.randomUUID();
    const toast: ToastData = {
      id,
      dismissible: true,
      duration: 5000,
      ...config,
    };

    this.toasts.update(list => [...list, toast]);

    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => this.dismiss(id), toast.duration);
      this._timers.set(id, timer);
    }

    return id;
  }

  /** Dismiss a toast by id */
  dismiss(id: string): void {
    const timer = this._timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this._timers.delete(id);
    }
    this.toasts.update(list => list.filter(t => t.id !== id));
  }

  /** Clear all toasts */
  clear(): void {
    this._timers.forEach(timer => clearTimeout(timer));
    this._timers.clear();
    this.toasts.set([]);
  }

  // Convenience helpers 

  success(title: string, message: string, subtitle?: string): string {
    return this.show({ type: 'success', title, message, subtitle });
  }

  error(title: string, message: string, subtitle?: string): string {
    return this.show({ type: 'error', title, message, subtitle, duration: 8000 });
  }

  warning(title: string, message: string, subtitle?: string): string {
    return this.show({ type: 'warning', title, message, subtitle });
  }

  info(title: string, message: string, subtitle?: string): string {
    return this.show({ type: 'info', title, message, subtitle });
  }
}
