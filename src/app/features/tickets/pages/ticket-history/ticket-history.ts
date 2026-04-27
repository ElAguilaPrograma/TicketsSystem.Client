import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { NgIcon, provideIcons } from '@ng-icons/core';
import { 
  heroEye, 
  heroClock, 
  heroArrowPath, 
  heroArrowDownTray, 
  heroTicket, 
  heroArrowTopRightOnSquare,
  heroArrowUturnLeft,
  heroUser,
  heroEnvelopeOpen
  } from '@ng-icons/heroicons/outline';
import { Router } from '@angular/router';
import { Label } from '../../../../shared/components/label/label';
import { Select } from '../../../../shared/components/select/select';
import { Searchbar } from '../../../../shared/components/searchbar/searchbar';
import { FormsModule } from '@angular/forms';
import { TicketService } from '../../../../api/services/ticket.service';
import { IReadTickets } from '../../../../api/interfaces/tickets/IReadTickets';
import { AuthenticationService } from '../../../../api/services/authentication.service';
import { StatusChipComponent } from '../../../../shared/components/status-chip/status-chip';

@Component({
  selector: 'app-ticket-history',
  imports: [CommonModule, ButtonComponent, NgIcon, Label, DatePipe, Select, Searchbar, FormsModule, StatusChipComponent],
  viewProviders: [provideIcons({ 
    heroEye, 
    heroClock, 
    heroArrowPath, 
    heroArrowDownTray, 
    heroTicket, 
    heroArrowTopRightOnSquare, 
    heroArrowUturnLeft, 
    heroUser, 
    heroEnvelopeOpen})],
  providers: [DatePipe],
  templateUrl: './ticket-history.html',
  styleUrl: './ticket-history.css',
})
export class TicketHistory implements OnInit {
  private router = inject(Router);
  private ticketService = inject(TicketService);
  private cdr = inject(ChangeDetectorRef);
  private datePipe = inject(DatePipe);
  private authService = inject(AuthenticationService);

  activeTab: 'my-tickets' | 'all' = 'my-tickets';
  recentTickets: IReadTickets[] = [];
  isAdmin: boolean = this.authService.getCurrentUserRole() === 'Admin';

  currentPage: number = 1;
  pageSize: number = 4;
  totalPages: number = 1;
  totalCount: number = 0;
  disabledBotton: boolean = false;
  pageNumbers: number[] = [1];

  statusFilter: string = 'All';
  priorityFilter: string = 'All';
  searchQuery: string = '';
  currentUserOnly: boolean = true;
  assignedToMeOnly: boolean = false;

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

  ngOnInit(): void {
    this.loadTickets();
  }

  switchTab(tab: 'my-tickets' | 'all'): void {
    if (tab === 'all' && !this.isAdmin) {
      return;
    }

    if (this.activeTab !== tab) {
      this.activeTab = tab;
      this.currentPage = 1;

      if (tab === 'my-tickets') {
        this.currentUserOnly = true;
        this.assignedToMeOnly = false;
      } else {
        this.currentUserOnly = false;
        this.assignedToMeOnly = false;
      }

      this.loadTickets();
    }
  }

  navigateToTicketHistoy(ticketId: string): void {
    this.router.navigate(["/ticket-change-history", ticketId]);
  }

  navigateToTicketsDetails(ticketId: string): void {
    this.router.navigate(["/ticket-details", ticketId]);
  }

  loadTickets(): void {
    this.disabledBotton = true;
    this.ticketService.getTickets(
      this.currentPage,
      this.pageSize,
      null,
      this.currentUserOnly,
      this.statusFilter,
      this.priorityFilter,
      null,
      null,
      this.searchQuery,
      null,
      this.assignedToMeOnly
    ).subscribe({
      next: (res) => {
        this.recentTickets = res.data;
        this.totalCount = res.totalCount;
        this.totalPages = res.totalPages;
        this.currentPage = res.page;
        this.updatePageNumbers();
        this.disabledBotton = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
        this.disabledBotton = false;
      }
    });
  }

  searchTickets(query: string): void {
    this.searchQuery = query;
    this.currentPage = 1;
    this.loadTickets();
  }

  exportHistory(): void {
    this.disabledBotton = true;
    this.ticketService.exportTickets(
      null, // userId
      this.currentUserOnly,
      this.statusFilter,
      this.priorityFilter,
      null, // month
      null, // year
      this.searchQuery,
      null, // hasAssignment
      this.assignedToMeOnly
    ).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const timestamp = this.datePipe.transform(new Date(), 'yyyyMMdd_HHmmss');
        a.download = `Tickets_Export_${timestamp}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        this.disabledBotton = false;
      },
      error: (error) => {
        console.error("Error exporting tickets", error);
        this.disabledBotton = false;
      }
    });
  }

  updatePageNumbers(): void {
    this.pageNumbers = [];
    for (let i = 1; i <= this.totalPages; i++) {
        this.pageNumbers.push(i);
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1 && !this.disabledBotton) {
      this.currentPage--;
      this.loadTickets();
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages && !this.disabledBotton) {
      this.currentPage++;
      this.loadTickets();
    }
  }

  goToPage(page: number): void {
    if (page !== this.currentPage && page >= 1 && page <= this.totalPages && !this.disabledBotton) {
      this.currentPage = page;
      this.loadTickets();
    }
  }
}
