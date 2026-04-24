import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationData, NotificationType } from '../../shared/components/notification/notification.types';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private router = inject(Router);

  /** Reactive list of active notifications */
  notifications = signal<NotificationData[]>([]);

  private _timers = new Map<string, ReturnType<typeof setTimeout>>();

  /**
   * Show a notification.
   * Returns the generated notification id.
   */
  show(config: Omit<NotificationData, 'id' | 'exiting'>): string {
    const id = crypto.randomUUID();
    const notification: NotificationData = {
      id,
      dismissible: true,
      ...config,
      exiting: false,
    };

    this.notifications.update(list => [...list, notification]);

    const duration = notification.duration ?? 5000;
    if (duration > 0) {
      const timer = setTimeout(() => this.dismiss(id), duration);
      this._timers.set(id, timer);
    }

    return id;
  }

  /** Dismiss a notification by id */
  dismiss(id: string): void {
    const timer = this._timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this._timers.delete(id);
    }
    this.notifications.update(list => list.filter(n => n.id !== id));
  }

  /** Clear all notifications */
  clear(): void {
    this._timers.forEach(timer => clearTimeout(timer));
    this._timers.clear();
    this.notifications.set([]);
  }

  /**
   * Plays exit animation, then navigates to the notification's route.
   */
  clickAndNavigate(id: string): void {
    const notification = this.notifications().find(n => n.id === id);
    if (!notification?.route) return;

    // Mark as exiting so the component plays the animation
    this.notifications.update(list =>
      list.map(n => n.id === id ? { ...n, exiting: true } : n)
    );

    // After the animation completes, navigate + dismiss
    const route = notification.route;
    setTimeout(() => {
      this.dismiss(id);
      this.router.navigateByUrl(route);
    }, 350);
  }

  // ── Urgency helpers ───────────────────────────────────

  /** 🔴 Critical – severe issues, longest duration (10 s), red pulsing accent */
  critical(title: string, message: string, route?: string): string {
    return this.show({ type: 'critical', title, message, route, duration: 10000 });
  }

  /** 🟠 High – important events like new tickets, orange accent (8 s) */
  high(title: string, message: string, route?: string): string {
    return this.show({ type: 'high', title, message, route, duration: 8000 });
  }

  /** 🔵 Update – a property was modified, blue/cyan accent (6 s) */
  update(title: string, message: string, route?: string): string {
    return this.show({ type: 'update', title, message, route, duration: 6000 });
  }

  /** ⚪ Info – general informational, neutral accent (5 s) */
  info(title: string, message: string, route?: string): string {
    return this.show({ type: 'info', title, message, route, duration: 5000 });
  }
}
