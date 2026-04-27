import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowLeft, heroPencil, heroArrowRight, heroUser, heroPlus, heroAdjustmentsHorizontal, heroLockClosed, heroArrowPath, heroCheckBadge } from '@ng-icons/heroicons/outline';
import { ActivatedRoute } from '@angular/router';
import { TicketService } from '../../../../api/services/ticket.service';
import { ITicketHistoryGroup } from '../../../../api/interfaces/tickets/history/ITicketHistoryGroup';
import { ITicketHistoryRead } from '../../../../api/interfaces/tickets/history/ITicketHistoryRead';
import { BreadcrumbService } from '../../../../core/services/breadcrumb.service';
import { UserAdminService } from '../../../../api/services/user-admin.service';
import { StatusEnum } from '../../../../core/enums/status_enum';
import { PriorityEnum } from '../../../../core/enums/priority_enum';

export type HighlightType = 'created' | 'closed' | 'reopened' | 'assigned' | null;

@Component({
  selector: 'app-ticket-change-history',
  imports: [CommonModule, NgIcon],
  providers: [
    DatePipe
  ],
  viewProviders: [provideIcons({ heroArrowLeft, heroPencil, heroArrowRight, heroUser, heroPlus, heroAdjustmentsHorizontal, heroLockClosed, heroArrowPath, heroCheckBadge })],
  templateUrl: './ticket-change-history.html',
  styleUrl: './ticket-change-history.css',
})
export class TicketChangeHistory implements OnInit {
  private route = inject(ActivatedRoute);
  private breadcrumbService = inject(BreadcrumbService);
  private ticketService = inject(TicketService);
  private userAdminService = inject(UserAdminService);

  ticketId = signal<string>('');
  historyGroups = signal<ITicketHistoryGroup[]>([]);
  userMap = signal<Map<string, string>>(new Map());

  private readonly fieldNameMap: Record<string, string> = {
    'ticket created': 'Ticket Created',
    'title': 'Title',
    'description': 'Description',
    'statusid': 'Status',
    'status': 'Status',
    'priorityid': 'Priority',
    'priority': 'Priority',
    'assignedtouserid': 'Assigned To',
    'createdbyuserid': 'Created By',
    'updatedat': 'Updated At',
    'createdat': 'Created At',
    'closedat': 'Closed At',
  };

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('ticketId');
    if (id) {
      this.ticketId.set(id);
      this.loadHistory(id);
    }
    this.loadUsers();
  }

  loadHistory(id: string) {
    this.ticketService.getTicketHistory(id).subscribe({
      next: (data: ITicketHistoryGroup[]) => {
        this.historyGroups.set(data);
      },
      error: (err) => console.error('Failed to load history:', err)
    });
  }

  loadUsers() {
    this.userAdminService.getUsers(1, 999, 'All Roles', 'All', '').subscribe({
      next: (res) => {
        const map = new Map<string, string>();
        for (const user of res.data) {
          map.set(user.userId, user.fullName);
        }
        this.userMap.set(map);
      },
      error: (err) => console.error('Failed to load users:', err)
    });
  }

  getHighlightType(group: ITicketHistoryGroup): HighlightType {
    for (const change of group.changes) {
      const field = change.fieldName?.toLowerCase() || '';

      if (field === 'ticket created') return 'created';

      if (field.includes('status') || field === 'statusid') {
        const newVal = this.getDisplayValue(change.fieldName, change.newValue)?.toLowerCase();
        if (newVal === 'closed') return 'closed';
        if (newVal === 'reopened') return 'reopened';
      }

      if (field.includes('assignedtouserid') && this.hasValue(change.newValue)) {
        return 'assigned';
      }
    }
    return null;
  }

  getHighlightIcon(highlightType: HighlightType): string {
    switch (highlightType) {
      case 'created': return 'heroPlus';
      case 'closed': return 'heroLockClosed';
      case 'reopened': return 'heroArrowPath';
      case 'assigned': return 'heroCheckBadge';
      default: return 'heroAdjustmentsHorizontal';
    }
  }

  getHighlightBgClass(highlightType: HighlightType): string {
    switch (highlightType) {
      case 'created': return 'bg-sky-500';
      case 'closed': return 'bg-emerald-500';
      case 'reopened': return 'bg-rose-500';
      case 'assigned': return 'bg-indigo-500';
      default: return 'bg-slate-500';
    }
  }

  getHighlightCardClass(highlightType: HighlightType): string {
    switch (highlightType) {
      case 'created': return 'highlight-card-created';
      case 'closed': return 'highlight-card-closed';
      case 'reopened': return 'highlight-card-reopened';
      case 'assigned': return 'highlight-card-assigned';
      default: return '';
    }
  }

  getHighlightBadge(highlightType: HighlightType): string {
    switch (highlightType) {
      case 'created': return 'Created';
      case 'closed': return 'Closed';
      case 'reopened': return 'Reopened';
      case 'assigned': return 'Assigned';
      default: return '';
    }
  }

  getHighlightBadgeClass(highlightType: HighlightType): string {
    switch (highlightType) {
      case 'created': return 'badge-created';
      case 'closed': return 'badge-closed';
      case 'reopened': return 'badge-reopened';
      case 'assigned': return 'badge-assigned';
      default: return '';
    }
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

  getInitials(fullName: string): string {
    if (!fullName) return 'U';
    const parts = fullName.split(' ').filter(p => p.length > 0);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  }

  getColorClassForUser(fullName: string): string {
    const colors = ['text-amber-500 bg-amber-500/20', 'text-emerald-500 bg-emerald-500/20', 'text-blue-500 bg-blue-500/20', 'text-purple-500 bg-purple-500/20', 'text-rose-500 bg-rose-500/20'];
    const index = (fullName?.length || 0) % colors.length;
    return colors[index];
  }

  getDisplayFieldName(fieldName: string): string {
    const key = fieldName?.toLowerCase() || '';
    if (this.fieldNameMap[key]) {
      return this.fieldNameMap[key];
    }
    return fieldName
      .replace(/Id$/g, '')
      .replace(/([A-Z])/g, ' $1')
      .trim();
  }

  private getStatusName(value: string): string {
    const map: Record<number, string> = {
      [StatusEnum.Open]: 'Open',
      [StatusEnum.InProgress]: 'In Progress',
      [StatusEnum.OnHold]: 'On Hold',
      [StatusEnum.Closed]: 'Closed',
      [StatusEnum.Reopened]: 'Reopened',
    };
    const num = Number(value);
    if (!isNaN(num) && map[num]) {
      return map[num];
    }
    return value;
  }

  private getPriorityName(value: string): string {
    const map: Record<number, string> = {
      [PriorityEnum.Low]: 'Low',
      [PriorityEnum.Medium]: 'Medium',
      [PriorityEnum.High]: 'High',
      [PriorityEnum.Critical]: 'Critical',
    };
    const num = Number(value);
    if (!isNaN(num) && map[num]) {
      return map[num];
    }
    return value;
  }

  getDisplayValue(fieldName: string, value: string | null): string {
    if (!this.hasValue(value)) return '';

    const key = fieldName?.toLowerCase() || '';

    if (key.includes('status') || key === 'status' || key === 'statusid') {
      return this.getStatusName(value!);
    }

    if (key.includes('priority') || key === 'priority' || key === 'priorityid') {
      return this.getPriorityName(value!);
    }

    if (key.includes('userid') || key.includes('user')) {
      const userName = this.userMap().get(value!);
      if (userName) return userName;
    }

    return value!;
  }

  isCreationChange(change: ITicketHistoryRead): boolean {
    return change.fieldName?.toLowerCase() === 'ticket created';
  }

  hasValue(value: string | null | undefined): boolean {
    return value !== null && value !== undefined && value !== '';
  }

  goBack() {
    this.breadcrumbService.goBack(`/ticket-details/${this.ticketId()}`);
  }
}