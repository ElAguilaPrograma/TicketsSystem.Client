import { Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  heroXMark,
  heroBellAlert,
  heroExclamationTriangle,
  heroArrowPath,
  heroInformationCircle,
} from '@ng-icons/heroicons/outline';
import { NotificationService } from '../../../core/services/notification.service';
import { NotificationType } from './notification.types';

@Component({
  selector: 'app-notification-container',
  standalone: true,
  imports: [NgIcon],
  viewProviders: [
    provideIcons({
      heroBellAlert,
      heroExclamationTriangle,
      heroArrowPath,
      heroInformationCircle,
      heroXMark,
    }),
  ],
  templateUrl: './notification.html',
  styleUrl: './notification.css',
})
export class NotificationContainer {
  notificationService = inject(NotificationService);

  iconName(type: NotificationType): string {
    const map: Record<NotificationType, string> = {
      critical: 'heroBellAlert',
      high: 'heroExclamationTriangle',
      update: 'heroArrowPath',
      info: 'heroInformationCircle',
    };
    return map[type];
  }

  /** CSS class for the icon badge background */
  iconBgClass(type: NotificationType): string {
    const map: Record<NotificationType, string> = {
      critical: 'notif-icon--critical',
      high: 'notif-icon--high',
      update: 'notif-icon--update',
      info: 'notif-icon--info',
    };
    return map[type];
  }

  /** CSS class for the left accent border */
  accentClass(type: NotificationType): string {
    const map: Record<NotificationType, string> = {
      critical: 'notif-accent--critical',
      high: 'notif-accent--high',
      update: 'notif-accent--update',
      info: 'notif-accent--info',
    };
    return map[type];
  }

  onClick(id: string): void {
    this.notificationService.clickAndNavigate(id);
  }

  dismiss(event: Event, id: string): void {
    event.stopPropagation(); // don't trigger navigation
    this.notificationService.dismiss(id);
  }
}
