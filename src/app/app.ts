import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastContainer } from './shared/components/toast/toast';
import { NotificationContainer } from './shared/components/notification/notification';
import { SignalrNotificationInitializer } from './core/services/signalr-notification.initializer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastContainer, NotificationContainer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('TicketsSystem.Client');

  private signalrNotifications = inject(SignalrNotificationInitializer);

  constructor() {
    this.signalrNotifications.init();
  }
}

