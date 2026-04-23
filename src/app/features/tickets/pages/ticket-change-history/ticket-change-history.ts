import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowLeft, heroPencil, heroArrowRight, heroUser, heroPlus, heroAdjustmentsHorizontal } from '@ng-icons/heroicons/outline';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketService } from '../../../../api/services/ticket.service';
import { ITicketHistoryGroup } from '../../../../api/interfaces/tickets/history/ITicketHistoryGroup';
import { BreadcrumbService } from '../../../../core/services/breadcrumb.service';

@Component({
  selector: 'app-ticket-change-history',
  imports: [CommonModule, ButtonComponent, NgIcon],
  providers: [
    DatePipe
  ],
  viewProviders: [provideIcons({ heroArrowLeft, heroPencil, heroArrowRight, heroUser, heroPlus, heroAdjustmentsHorizontal })],
  templateUrl: './ticket-change-history.html',
  styleUrl: './ticket-change-history.css',
})
export class TicketChangeHistory implements OnInit {
  private route = inject(ActivatedRoute);
  private breadcrumbService = inject(BreadcrumbService);
  private ticketService = inject(TicketService);

  ticketId = signal<string>('');
  historyGroups = signal<ITicketHistoryGroup[]>([]);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('ticketId');
    if (id) {
      this.ticketId.set(id);
      this.loadHistory(id);
    }
  }

  loadHistory(id: string) {
    this.ticketService.getTicketHistory(id).subscribe({
      next: (data: ITicketHistoryGroup[]) => {
        this.historyGroups.set(data);
      },
      error: (err) => console.error('Failed to load history:', err)
    });
  }

  getInitials(fullName: string): string {
    if (!fullName) return 'U';
    const parts = fullName.split(' ').filter(p => p.length > 0);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  }

  getIconForField(fieldName: string): string {
    const lowerName = fieldName?.toLowerCase() || '';
    if (lowerName.includes('status')) return 'heroPencil';
    if (lowerName.includes('user') || lowerName.includes('assignee')) return 'heroUser';
    if (lowerName === 'ticket created' || lowerName === 'created') return 'heroPlus';
    return 'heroAdjustmentsHorizontal';
  }

  getBgClassForField(fieldName: string): string {
    const lowerName = fieldName?.toLowerCase() || '';
    if (lowerName.includes('status')) return 'bg-brand-primary';
    if (lowerName.includes('user') || lowerName.includes('assignee')) return 'bg-brand-secondary';
    if (lowerName === 'ticket created' || lowerName === 'created') return 'bg-emerald-500';
    return 'bg-gray-500';
  }

  getColorClassForUser(fullName: string): string {
    const colors = ['text-amber-500 bg-amber-500/20', 'text-emerald-500 bg-emerald-500/20', 'text-blue-500 bg-blue-500/20', 'text-purple-500 bg-purple-500/20', 'text-rose-500 bg-rose-500/20'];
    const index = (fullName?.length || 0) % colors.length;
    return colors[index];
  }

  goBack() {
    this.breadcrumbService.goBack(`/ticket-details/${this.ticketId()}`);
  }
}
