import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { CardComponent } from "../../../../shared/components/card/card.component";
import { NgIcon, provideIcons } from '@ng-icons/core';
import { DashboardService } from '../../../../api/services/dashboard.service';
import { IDashboardRecentTicket } from '../../../../api/interfaces/dashboard/IDashboardSummary';
import { TicketService } from '../../../../api/services/ticket.service';
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
export class Main implements OnInit {
  private router = inject(Router);
  private dashboardService = inject(DashboardService);
  private ticketService = inject(TicketService);
  private cdr = inject(ChangeDetectorRef);

  totalTickets: number = 0;
  openTickets: number = 0;
  resolvedToday: number = 0;
  avgResolutionTime: string = '0 hrs';
  isLoading: boolean = false;
  errorMessage: string = '';
  disabledButton: boolean = false;

  priorityStats = {
    critical: { count: 0, percentage: 0 },
    high: { count: 0, percentage: 0 },
    medium: { count: 0, percentage: 0 },
    low: { count: 0, percentage: 0 }
  };

  statusStats = {
    open: { count: 0, percentage: 0 },
    inProgress: { count: 0, percentage: 0 },
    resolved: { count: 0, percentage: 0 }
  };

  recentTickets: IDashboardRecentTicket[] = [];

  ngOnInit(): void {
    this.loadDashboard();
  }

  navigateToCreateTicket() {
    this.router.navigate(['/ticket-form']);
  }

  ExportToExcel() {
    this.isLoading = true;
    this.disabledButton = true;
    const timezoneOffsetMinutes = new Date().getTimezoneOffset();
    this.ticketService.exportTickets(
      null,
      false,
      "All",
      "All",
      null,
      null,
      "",
      null,
      false,
      timezoneOffsetMinutes
    ).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tickets.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
        this.isLoading = false;
        this.disabledButton = false;
      },
      error: (err) => {
        this.errorMessage = 'Error exporting tickets: ' + err;
        this.isLoading = false;
        this.disabledButton = false;
      }
    });
  }

  private loadDashboard(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.disabledButton = true;
    this.dashboardService.getDashboardSummary({
      currentUserOnly: false,
      assignedToMeOnly: false,
      recentTicketsTake: 5
    }).subscribe({
      next: (summary) => {
        this.totalTickets = summary.totalTickets;
        this.openTickets = summary.openTickets + summary.inProgressTickets;
        this.resolvedToday = summary.resolvedToday;
        this.avgResolutionTime = `${summary.avgResolutionHours.toFixed(1)} hrs`;
        this.recentTickets = summary.recentTickets;

        this.buildStatusStats(summary.ticketsByStatus);
        this.buildPriorityStats(summary.ticketsByPriority);

        this.isLoading = false;
        this.disabledButton = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'Error loading dashboard: ' + err;
        this.isLoading = false;
        this.disabledButton = false;
      }
    });
  }

  private buildStatusStats(statusCounts: Record<string, number>): void {
    const open = statusCounts['Open'] ?? 0;
    const inProgress = statusCounts['In Progress'] ?? 0;
    const resolved = statusCounts['Closed'] ?? 0;
    const total = open + inProgress + resolved;

    this.statusStats = {
      open: { count: open, percentage: this.percentage(open, total) },
      inProgress: { count: inProgress, percentage: this.percentage(inProgress, total) },
      resolved: { count: resolved, percentage: this.percentage(resolved, total) }
    };
  }

  private buildPriorityStats(priorityCounts: Record<string, number>): void {
    const critical = priorityCounts['Critical'] ?? 0;
    const high = priorityCounts['High'] ?? 0;
    const medium = priorityCounts['Medium'] ?? 0;
    const low = priorityCounts['Low'] ?? 0;
    const total = critical + high + medium + low;

    this.priorityStats = {
      critical: { count: critical, percentage: this.percentage(critical, total) },
      high: { count: high, percentage: this.percentage(high, total) },
      medium: { count: medium, percentage: this.percentage(medium, total) },
      low: { count: low, percentage: this.percentage(low, total) }
    };
  }

  private percentage(count: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((count / total) * 100);
  }
}
