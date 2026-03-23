import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroPlus, heroEye, heroTicket, heroArrowTopRightOnSquare } from '@ng-icons/heroicons/outline';
import { Label } from '../../../../shared/components/label/label';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { Searchbar } from '../../../../shared/components/searchbar/searchbar';
import { Select } from '../../../../shared/components/select/select';
import { ICurrentUserTicketsCount } from '../../../../api/interfaces/tickets/ICurrentUserTicketsCount';
import { TicketService } from '../../../../api/services/ticket.service';
import { IReadTickets } from '../../../../api/interfaces/tickets/IReadTickets';

@Component({
  selector: 'app-ticket-main',
  imports: [CommonModule, FormsModule, NgIcon, ButtonComponent, CardComponent, Searchbar, Select, Label],
  viewProviders: [provideIcons({ heroPlus, heroEye, heroTicket, heroArrowTopRightOnSquare })],
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

  statusFilter: string = 'All';
  priorityFilter: string = 'All';
  searchQuery: string = '';
  currentUserOnly: boolean = true;

  currentPage: number = 1;
  pageSize: number = 5;
  totalCount: number = 0;
  totalPages: number = 0;

  pageNumbers: number[] = [];

  statusOptions = [
    { label: 'All Statuses', value: 'All' },
    { label: 'Open', value: 'Open' },
    { label: 'In Progress', value: 'InProgress' },
    { label: 'On Hold', value: 'OnHold' },
    { label: 'Closed', value: 'Closed' },
    { label: 'Reopened', value: 'Reopened' }
  ];

  priorityOptions = [
    { label: 'All Priorities', value: 'All' },
    { label: 'Critical', value: 'Critical' },
    { label: 'High', value: 'High' },
    { label: 'Medium', value: 'Medium' },
    { label: 'Low', value: 'Low' }
  ];

  recentTickets: IReadTickets[] = [];

  ngOnInit(): void {
    this.loadTickets();
    this.loadTicketsCount();
  }

  navigateToCreateTicket(): void {
    this.router.navigate(['/ticket-form']);
  }

  navigateToViewTicket(ticketId: string): void {
    this.router.navigate(['/ticket-details', ticketId]);
  }

  searchTickets(query: string): void {
    this.searchQuery = query;
    this.loadTickets();
  }

  loadTickets(): void {
    this.ticketService.getTickets(
      this.currentPage,
      this.pageSize,
      null,
      this.currentUserOnly,
      this.statusFilter,
      this.priorityFilter,
      null,
      null,
      this.searchQuery
    ).subscribe({
      next: (res) => {
        this.recentTickets = res.data;
        this.totalCount = res.totalCount;
        this.totalPages = res.totalPages;
        this.currentPage = res.page;
        this.cdr.detectChanges();
        console.log(res);
      },
      error: (error) => {
        console.error(error);
      }
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
