import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { ICurrentUserTicketsCount } from '../../../../api/interfaces/tickets/ICurrentUserTicketsCount';
import { TicketService } from '../../../../api/services/ticket.service';

@Component({
  selector: 'app-ticket-main',
  imports: [CommonModule, ButtonComponent, CardComponent],
  templateUrl: './ticket-main.html',
  styleUrl: './ticket-main.css',
})
export class TicketMain implements OnInit {
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private ticketService = inject(TicketService);

  ticketsCount: ICurrentUserTicketsCount = {
    totalTickets: 0,
    ticketsOpen: 0,
    ticketsReopen: 0,
    ticketsClosed: 0
  };

  ngOnInit(): void {
    this.loadTicketsCount();
  }

  navigateToCreateTicket(): void {
    this.router.navigate(['/ticket-form']);
  }

  navigateToCreateTicketWithPreset(title: string, description: string, priorityId: number): void {
    this.router.navigate(['/ticket-form'], {
      queryParams: {
        title,
        description,
        priorityId,
      },
    });
  }

  loadTicketsCount(): void {
    this.ticketService.getCurrentUserTicketsCount().subscribe({
      next: (data) => {
        this.ticketsCount = data;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

}
