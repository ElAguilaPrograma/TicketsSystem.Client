import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  heroBellAlert,
  heroBell,
  heroCheckCircle,
  heroEnvelope,
  heroEnvelopeOpen,
  heroClock,
  heroExclamationTriangle,
  heroArrowPath,
} from '@ng-icons/heroicons/outline';
import { NotificationApiService } from '../../api/services/notificationApi.service';
import { AuthenticationService } from '../../api/services/authentication.service';
import { SignalRService } from '../../api/services/signalR.service';
import { INotificationRead } from '../../api/interfaces/notifications/INotificationRead';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { getTimeAgo } from '../../core/helpers/get_time_ago';

@Component({
  selector: 'app-notifications-view',
  standalone: true,
  imports: [CommonModule, NgIcon],
  viewProviders: [
    provideIcons({
      heroBellAlert,
      heroBell,
      heroCheckCircle,
      heroEnvelope,
      heroEnvelopeOpen,
      heroClock,
      heroExclamationTriangle,
      heroArrowPath,
    }),
  ],
  templateUrl: './notifications-view.html',
  styleUrl: './notifications-view.css',
})
export class NotificationsView implements OnInit, OnDestroy {
  private notificationApi = inject(NotificationApiService);
  private authService = inject(AuthenticationService);
  private signalR = inject(SignalRService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  activeTab = signal<'unread' | 'read'>('unread');
  noReadNotifications: INotificationRead[] = [];
  readNotifications: INotificationRead[] = [];
  loading = true;

  private subs: Subscription[] = [];

  ngOnInit(): void {
    this.loadNotifications();
    this.listenForRealTimeUpdates();
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  switchTab(tab: 'unread' | 'read'): void {
    this.activeTab.set(tab);
  }

  navigateToTicket(ticketId: string): void {
    this.router.navigate(['/ticket-details', ticketId]);
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'NewTicket': return 'heroBellAlert';
      case 'UpdateTicket': return 'heroArrowPath';
      default: return 'heroBell';
    }
  }

  getTypeLabel(type: string): string {
    switch (type) {
      case 'NewTicket': return 'New Ticket';
      case 'UpdateTicket': return 'Update';
      default: return 'Notification';
    }
  }

  getTimeAgo = getTimeAgo;

  private loadNotifications(): void {
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      this.loading = false;
      return;
    }

    this.notificationApi.getNotifications(userId).subscribe({
      next: (notifications: any) => {
        const all: INotificationRead[] = Array.isArray(notifications) ? notifications : [notifications];
        this.noReadNotifications = all.filter(n => !n.isRead);
        this.readNotifications = all.filter(n => n.isRead);
        this.loading = false;
        this.cdr.detectChanges();
        console.log('Notifications loaded:', all);
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private listenForRealTimeUpdates(): void {
    this.subs.push(
      this.signalR.newTicket$.subscribe(() => this.loadNotifications())
    );
    this.subs.push(
      this.signalR.ticketStatusChanged$.subscribe(() => this.loadNotifications())
    );
    this.subs.push(
      this.signalR.ticketComment$.subscribe(() => this.loadNotifications())
    );
  }

  public toogleNotificationReadStatus(notificationId: string): void {
    this.notificationApi.toogleNotificationReadStatus(notificationId).subscribe({
      next: () => {
        this.loadNotifications();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  public sendToContent(notification: INotificationRead): void {
    if (notification.type === 'NewTicket' || notification.type === 'UpdateTicket') {
      this.router.navigate(['/ticket-details', notification.contentId]);
    }
  }
}

export enum NotificationsTypes {
    NewTicket = 1,
    UpdateTicket = 2,
    UpdateUserChanges = 3,
    AssingTicketToAgent = 4,
    CreateANewComment = 5,
    UpdateAComment = 6,
}