import { inject, Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../env/enviroment';
import { Subject } from 'rxjs';
import { ITicketsReadComment } from '../interfaces/ticket-comment/ITicketsReadComment';
import { IReadTickets } from '../interfaces/tickets/IReadTickets';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection?: signalR.HubConnection;

  // Subject used to notify new comments in real time
  private ticketCommentSubject = new Subject<ITicketsReadComment>();
  public ticketComment$ = this.ticketCommentSubject.asObservable();

  // Subject used to notify new tickets
  private newTicketSubject = new Subject<IReadTickets>();
  public newTicket$ = this.newTicketSubject.asObservable();

  // Subject used to notify ticket status changes
  private ticketStatusChangedSubject = new Subject<IReadTickets>();
  public ticketStatusChanged$ = this.ticketStatusChangedSubject.asObservable();

  constructor() { }

  /**
    * Starts the SignalR Hub connection
   */
  public startConnection(): void {
    if (this.hubConnection?.state === signalR.HubConnectionState.Connected ||
      this.hubConnection?.state === signalR.HubConnectionState.Connecting) {
      return;
    }

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.hubUrl, {
        withCredentials: true // Sends the HttpOnly 'AuthToken' cookie automatically
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('SignalR: Connection Started'))
      .catch(err => console.log('SignalR: Error while starting connection: ' + err));

    this.registerOnEvents();
  }

  /**
    * Stops the connection (useful on logout)
   */
  public stopConnection(): void {
    if (this.hubConnection) {
      this.hubConnection.stop()
        .then(() => console.log('SignalR: Connection Stopped'));
    }
  }

  /**
   * Registers listeners for backend-defined events
   */
  private registerOnEvents(): void {
    // Listen for new comments (event: ReceiveNewTicketComment)
    this.hubConnection?.on('ReceiveNewTicketComment', (comment: ITicketsReadComment) => {
      this.ticketCommentSubject.next(comment);
    });

    // Listen for new tickets (event: ReceiveNewTicket)
    this.hubConnection?.on('ReceiveNewTicket', (ticket: IReadTickets) => {
      this.newTicketSubject.next(ticket);
    });

    // Listen for ticket status changes (event: ReceiveNewTicketStatusChange)
    this.hubConnection?.on('ReceiveNewTicketStatusChange', (ticket: IReadTickets) => {
      this.ticketStatusChangedSubject.next(ticket);
    });
  }
}

