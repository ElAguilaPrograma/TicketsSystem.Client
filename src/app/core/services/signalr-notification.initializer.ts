import { inject, Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SignalRService } from '../../api/services/signalR.service';
import { NotificationService } from './notification.service';

/**
 * Bridges SignalR real-time events to the NotificationService.
 * Call `init()` once (e.g. in App component constructor).
 */
@Injectable({
  providedIn: 'root'
})
export class SignalrNotificationInitializer implements OnDestroy {
  private signalR = inject(SignalRService);
  private notifications = inject(NotificationService);
  private subs: Subscription[] = [];
  private initialized = false;

  init(): void {
    if (this.initialized) return;
    this.initialized = true;

    // 🟠 New ticket created → high urgency
    this.subs.push(
      this.signalR.newTicket$.subscribe(ticket => {
        this.notifications.high(
          'Nuevo Ticket',
          `"${ticket.title}" creado por ${ticket.createdByUser ?? 'un usuario'}`,
          `/ticket-details/${ticket.ticketId}`
        );
      })
    );

    // 🔵 Ticket status changed → update
    this.subs.push(
      this.signalR.ticketStatusChanged$.subscribe(ticket => {
        this.notifications.update(
          'Estado Actualizado',
          `"${ticket.title}" cambió a ${ticket.statusName ?? 'nuevo estado'}`,
          `/ticket-details/${ticket.ticketId}`
        );
      })
    );

    // ⚪ New comment on ticket → info
    this.subs.push(
      this.signalR.ticketComment$.subscribe(comment => {
        this.notifications.info(
          'Nuevo Comentario',
          `${comment.createdByUser}: "${comment.content.substring(0, 80)}${comment.content.length > 80 ? '…' : ''}"`,
          `/ticket-details/${comment.ticketId}`
        );
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }
}
