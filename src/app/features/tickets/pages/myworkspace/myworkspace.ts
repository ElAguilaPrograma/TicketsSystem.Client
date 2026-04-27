import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroBriefcase, heroArrowTopRightOnSquare, heroTicket } from '@ng-icons/heroicons/outline';
import { Label } from '../../../../shared/components/label/label';
import { Searchbar } from '../../../../shared/components/searchbar/searchbar';
import { Select } from '../../../../shared/components/select/select';
import { TicketService } from '../../../../api/services/ticket.service';
import { IReadTickets } from '../../../../api/interfaces/tickets/IReadTickets';
import { StatusChipComponent } from '../../../../shared/components/status-chip/status-chip';

@Component({
  selector: 'app-myworkspace',
  imports: [CommonModule, FormsModule, NgIcon, Searchbar, Select, Label, StatusChipComponent],
  viewProviders: [provideIcons({ heroBriefcase, heroArrowTopRightOnSquare, heroTicket })],
  templateUrl: './myworkspace.html'
})
export class Myworkspace implements OnInit {
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private ticketService = inject(TicketService);

  statusFilter: string = 'All';
  priorityFilter: string = 'All';
  searchQuery: string = '';

  currentPage: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;
  totalPages: number = 0;

  statusOptions = [
    { label: 'All Statuses', value: 'All' },
    { label: 'Open', value: 'Open' },
    { label: 'In Progress', value: 'InProgress' },
    { label: 'On Hold', value: 'OnHold' }
  ];

  priorityOptions = [
    { label: 'All Priorities', value: 'All' },
    { label: 'Critical', value: 'Critical' },
    { label: 'High', value: 'High' },
    { label: 'Medium', value: 'Medium' },
    { label: 'Low', value: 'Low' }
  ];

  myTickets: IReadTickets[] = [];

  ngOnInit(): void {
    this.loadTickets();
  }

  navigateToViewTicket(ticketId: string): void {
    this.router.navigate(['/ticket-details', ticketId]);
  }

  searchTickets(query: string): void {
    this.searchQuery = query;
    this.currentPage = 1;
    this.loadTickets();
  }

  loadTickets(): void {
    this.ticketService.getTickets(
      this.currentPage,
      this.pageSize,
      null, // userId
      false, // currentUserOnly
      this.statusFilter,
      this.priorityFilter,
      null, // month
      null, // year
      this.searchQuery,
      null, // hasAssignment
      true  // assignedToMeOnly
    ).subscribe({
      next: (res) => {
        this.myTickets = res.data;
        this.totalCount = res.totalCount;
        this.totalPages = res.totalPages;
        this.currentPage = res.page;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}
