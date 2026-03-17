import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroPlus, heroEye, heroTicket } from '@ng-icons/heroicons/outline';

import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { Searchbar } from '../../../../shared/components/searchbar/searchbar';
import { Select } from '../../../../shared/components/select/select';

@Component({
  selector: 'app-ticket-main',
  imports: [CommonModule, FormsModule, NgIcon, ButtonComponent, CardComponent, Searchbar, Select],
  viewProviders: [provideIcons({ heroPlus, heroEye, heroTicket })],
  templateUrl: './ticket-main.html',
  styleUrl: './ticket-main.css',
})
export class TicketMain implements OnInit {
  private router = inject(Router);

  // Mock data for UI demonstration
  ticketsCount = {
    total: 12,
    open: 4,
    inProgress: 3,
    closed: 5
  };

  statusFilter: string = 'All';
  searchQuery: string = '';

  statusOptions = [
    { label: 'All Statuses', value: 'All' },
    { label: 'Open', value: 'Open' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Closed', value: 'Closed' }
  ];

  recentTickets: any[] = [
    { id: '1001', subject: 'Login issue on mobile app', status: 'Open', priority: 'High', createdAt: new Date(Date.now() - 3600000 * 2) },
    { id: '1002', subject: 'Request for software installation', status: 'In Progress', priority: 'Medium', createdAt: new Date(Date.now() - 86400000) },
    { id: '1003', subject: 'Unable to access shared drive', status: 'Closed', priority: 'High', createdAt: new Date(Date.now() - 86400000 * 2) },
    { id: '1004', subject: 'Monitor display flickering', status: 'Open', priority: 'Low', createdAt: new Date(Date.now() - 86400000 * 3) }
  ];

  ngOnInit(): void {
    this.loadTickets();
  }

  navigateToCreateTicket(): void {
    this.router.navigate(['/ticket-form']);
  }

  viewTicket(id: string): void {
    this.router.navigate(['/ticket-details', id]);
  }

  searchTickets(query: string): void {
    this.searchQuery = query;
    this.loadTickets();
  }

  loadTickets(): void {
    console.log(`Loading tickets with status: ${this.statusFilter} and query: ${this.searchQuery}`);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Open':
        return 'text-brand-primary bg-brand-primary/10 border-brand-primary/20';
      case 'In Progress':
        return 'text-amber-600 bg-amber-500/10 border-amber-500/20';
      case 'Closed':
        return 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20';
      default:
        return 'text-brand-text-muted bg-brand-bg/50 border-brand-border';
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'High':
        return 'bg-red-500';
      case 'Medium':
        return 'bg-amber-500';
      case 'Low':
        return 'bg-emerald-500';
      default:
        return 'bg-brand-border';
    }
  }
}
