import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { CardComponent } from "../../../../shared/components/card/card.component";
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  heroExclamationCircle,
  heroEllipsisHorizontal,
  heroCheckCircle,
  heroPlus,
  heroEllipsisVertical,
  heroClock,
  heroChartBar,
  heroTicket,
  heroFire,
  heroDocumentChartBar
} from '@ng-icons/heroicons/outline';

export interface Ticket {
  id: string;
  subject: string;
  reportedBy: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'Open' | 'In Progress' | 'Resolved';
  createdDate: string;
}

@Component({
  selector: 'app-main',
  imports: [CommonModule, ButtonComponent, CardComponent, NgIcon],
  viewProviders: [
    provideIcons({
      heroExclamationCircle,
      heroEllipsisHorizontal,
      heroCheckCircle,
      heroPlus,
      heroEllipsisVertical,
      heroClock,
      heroChartBar,
      heroTicket,
      heroFire,
      heroDocumentChartBar
    })
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Main {
  private router = inject(Router);

  // Mock KPIs
  totalTickets: number = 245;
  openTickets: number = 40;
  resolvedToday: number = 15;
  avgResolutionTime: string = '4.2 hrs';

  // Mock Chart Data
  priorityStats = {
    critical: { count: 12, percentage: 15 },
    high: { count: 35, percentage: 40 },
    medium: { count: 28, percentage: 30 },
    low: { count: 15, percentage: 15 }
  };

  statusStats = {
    open: { count: 25, percentage: 30 },
    inProgress: { count: 15, percentage: 20 },
    resolved: { count: 45, percentage: 50 }
  };

  navigateToCreateTicket() {
    this.router.navigate(['/ticket-form']);
  }

  ExportToExcel() {
    // Placeholder for export functionality
  }

  tickets: Ticket[] = [
    {
      id: 'INC-1024',
      subject: 'Server Latency in US-East-1 Region',
      reportedBy: 'Infrastructure Team',
      priority: 'CRITICAL',
      status: 'Open',
      createdDate: 'Oct 24, 2023 · 14:22'
    },
    {
      id: 'INC-1023',
      subject: 'VPN Authentication Failure',
      reportedBy: 'Sarah J. (Accounting)',
      priority: 'HIGH',
      status: 'In Progress',
      createdDate: 'Oct 24, 2023 · 12:45'
    },
    {
      id: 'INC-1022',
      subject: 'Printer Connection Issues - Floor 3',
      reportedBy: 'Facility Support',
      priority: 'LOW',
      status: 'Open',
      createdDate: 'Oct 24, 2023 · 09:12'
    },
    {
      id: 'INC-1021',
      subject: 'SaaS Integration Timeout',
      reportedBy: 'Automatic System Alert',
      priority: 'MEDIUM',
      status: 'Resolved',
      createdDate: 'Oct 23, 2023 · 16:55'
    }
  ];
}
