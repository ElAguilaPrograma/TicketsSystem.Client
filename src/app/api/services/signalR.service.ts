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

  // Subject para notificar nuevos comentarios en tiempo real
  private ticketCommentSubject = new Subject<ITicketsReadComment>();
  public ticketComment$ = this.ticketCommentSubject.asObservable();

  // Subject para notificar nuevos tickets
  private newTicketSubject = new Subject<IReadTickets>();
  public newTicket$ = this.newTicketSubject.asObservable();

  // Subject para notificar cambios de estado de ticket
  private ticketStatusChangedSubject = new Subject<IReadTickets>();
  public ticketStatusChanged$ = this.ticketStatusChangedSubject.asObservable();

  constructor() { }

  /**
   * Inicia la conexión con el Hub de SignalR
   */
  public startConnection(): void {
    if (this.hubConnection?.state === signalR.HubConnectionState.Connected ||
      this.hubConnection?.state === signalR.HubConnectionState.Connecting) {
      return;
    }

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.hubUrl, {
        withCredentials: true // Envía la cookie 'AuthToken' HttpOnly automáticamente
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
   * Detiene la conexión (útil al cerrar sesión)
   */
  public stopConnection(): void {
    if (this.hubConnection) {
      this.hubConnection.stop()
        .then(() => console.log('SignalR: Connection Stopped'));
    }
  }

  /**
   * Registra los escuchadores para los eventos definidos en el backend
   */
  private registerOnEvents(): void {
    // Escuchar nuevos comentarios (Evento: ReceiveNewTicketComment)
    this.hubConnection?.on('ReceiveNewTicketComment', (comment: ITicketsReadComment) => {
      this.ticketCommentSubject.next(comment);
    });

    // Escuchar nuevos tickets (Evento: ReceiveNewTicket)
    this.hubConnection?.on('ReceiveNewTicket', (ticket: IReadTickets) => {
      this.newTicketSubject.next(ticket);
    });

    // Escuchar cambios de estado de ticket (Evento: ReceiveNewTicketStatusChange)
    this.hubConnection?.on('ReceiveNewTicketStatusChange', (ticket: IReadTickets) => {
      this.ticketStatusChangedSubject.next(ticket);
    });
  }
}

