import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit, ElementRef, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowLeft, heroSparkles, heroDocument, heroChatBubbleLeftRight, heroPaperClip, heroTicket, heroClipboardDocumentList, heroArrowTopRightOnSquare } from '@ng-icons/heroicons/outline';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TicketService } from '../../../../api/services/ticket.service';
import { IReadTickets } from '../../../../api/interfaces/tickets/IReadTickets';
import { AuthenticationService } from '../../../../api/services/authentication.service';
import { Label } from "../../../../shared/components/label/label";
import { ITicketsReadComment } from '../../../../api/interfaces/ticket-comment/ITicketsReadComment';
import { TicketCommentService } from '../../../../api/services/ticket-comment.service';
import { SignalRService } from '../../../../api/services/signalR.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ICurrentUserInfo } from '../../../../api/interfaces/user/ICurrentUserInfo';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { BreadcrumbService } from '../../../../core/services/breadcrumb.service';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { ITicketHistoryGroup } from '../../../../api/interfaces/tickets/history/ITicketHistoryGroup';
import { ITicketHistoryRead } from '../../../../api/interfaces/tickets/history/ITicketHistoryRead';
import { StatusEnum } from '../../../../core/enums/status_enum';
import { PriorityEnum } from '../../../../core/enums/priority_enum';
import { StatusChipComponent } from '../../../../shared/components/status-chip/status-chip';
import { TicketAttachmentService } from '../../../../api/services/ticket-attachment.service';
import { ITicketAttachment } from '../../../../api/interfaces/ticket-attachment/ITicketAttachment';
import { StorageService } from '../../../../api/services/storage.service';
import { StorageBucket } from '../../../../core/enums/storage_bucket';
import { UserAdminService } from '../../../../api/services/user-admin.service';

@Component({
  selector: 'app-ticket-details',
  imports: [CommonModule, ButtonComponent, NgIcon, Label, RouterLink, FormsModule, StatusChipComponent, ModalComponent, ConfirmDialog],
  viewProviders: [provideIcons({ heroArrowLeft, heroSparkles, heroDocument, heroChatBubbleLeftRight, heroPaperClip, heroTicket, heroClipboardDocumentList, heroArrowTopRightOnSquare })],
  templateUrl: './ticket-details.html',
  styleUrl: './ticket-details.css',
})
export class TicketDetails implements OnInit, OnDestroy {
  private readonly resizeAnimationMs = 320;
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

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private ticketService = inject(TicketService);
  private authService = inject(AuthenticationService);
  private ticketCommentService = inject(TicketCommentService);
  private signalRService = inject(SignalRService);
  private breadcrumbService = inject(BreadcrumbService);
  private attachmentService = inject(TicketAttachmentService);
  private storageService = inject(StorageService);
  private userAdminService = inject(UserAdminService);
  private commentSubscription?: Subscription;

  ticketId: string = "";
  ticketData: IReadTickets = {} as IReadTickets;
  currentUserInfo: ICurrentUserInfo | null = this.authService.getCurrentUserInfo();

  ticketsComments: ITicketsReadComment[] = [];
  ticketCommentsNotInternal: ITicketsReadComment[] = [];
  ticketCommentsInternal: ITicketsReadComment[] = [];
  latestHistoryGroup: ITicketHistoryGroup | null = null;
  historyGroups: ITicketHistoryGroup[] = [];
  attachments: ITicketAttachment[] = [];
  selectedAttachment: ITicketAttachment | null = null;
  assignedUserProfileUrl: string | null = null;

  commentContentNotInternal: string = "";
  commentContentInternal: string = "";
  isInternal: boolean = false;
  isCommentsModalOpen: boolean = false;
  isInternalCommentsModalOpen: boolean = false;

  closeTicketConfirmDialogOpen = signal(false);
  closeReopenTicketConfirmDialogOpen = signal(false);
  attachmentConfirmDialogOpen = signal(false);
  private hasLoadedCommentsOnce = false;

  activeCommentTab: 'public' | 'internal' = 'public';
  
  get recentCommentsNotInternal(): ITicketsReadComment[] {
    return this.ticketCommentsNotInternal.slice(-4);
  }

  get recentCommentsInternal(): ITicketsReadComment[] {
    return this.ticketCommentsInternal.slice(-2);
  }

  @ViewChild('commentsScrollContainer') private commentsScrollContainer?: ElementRef<HTMLElement>;
  @ViewChild('internalCommentsScrollContainer') private internalCommentsScrollContainer?: ElementRef<HTMLElement>;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.ticketId = params.get('ticketId')!;
      this.loadTicketDetails();
      this.loadTicketComments();
      this.loadTicketHistory();
      this.loadTicketAttachments();
      this.scrollToBottom();
    })
    
    this.commentSubscription = this.signalRService.ticketComment$.subscribe(newComment => {
      if (newComment.ticketId === this.ticketId) {
        if (!this.ticketsComments.some(c => c.commentId === newComment.commentId)) {
          this.applyCommentsState([...this.ticketsComments, newComment]);
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.commentSubscription?.unsubscribe();
  }

  loadTicketComments(): void {
    this.ticketCommentService.getTicketComments(this.ticketId).subscribe({
      next: (response) => {
        this.applyCommentsState(response);
      },
      error: (error) => console.error(error)
    });
  }

  private applyCommentsState(comments: ITicketsReadComment[]): void {
    const shouldAnimateResize = this.hasLoadedCommentsOnce;

    this.ticketsComments = comments;
    this.ticketCommentsNotInternal = this.ticketsComments.filter(comment => !comment.isInternal);
    this.ticketCommentsInternal = this.ticketsComments.filter(comment => comment.isInternal);
    this.cdr.detectChanges();

    if (shouldAnimateResize) {
      this.scrollToBottom(this.resizeAnimationMs);
    } else {
      this.scrollToBottom();
      this.hasLoadedCommentsOnce = true;
    }
  }

  createTicketCommentNotInternal(): void {
    if (!this.commentContentNotInternal.trim()) return;
    const content = this.commentContentNotInternal;
    this.commentContentNotInternal = ''; 
    
    this.ticketCommentService.createTicketComment(this.ticketId, content, false).subscribe({
      next: () => {
        this.loadTicketComments();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
        this.commentContentNotInternal = content;
      }
    });
  }

  createTicketCommentInternal(): void {
    if (!this.commentContentInternal.trim()) return;
    const content = this.commentContentInternal;
    this.commentContentInternal = '';
    
    this.ticketCommentService.createTicketComment(this.ticketId, content, true).subscribe({
      next: () => {
        this.loadTicketComments();
      },
      error: (error) => {
        console.error(error);
        this.commentContentInternal = content;
      }
    });
  }

  loadTicketDetails(): void {
    this.ticketService.getTicketById(this.ticketId).subscribe({
      next: (response) => {
        this.ticketData = response;
        this.loadAssignedUserProfilePic();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

  private loadAssignedUserProfilePic(): void {
    const assignedUserId = this.ticketData.assignedToUserId;
    if (!assignedUserId) {
      this.assignedUserProfileUrl = null;
      return;
    }

    this.userAdminService.getUserProfilePicUrl(assignedUserId).subscribe({
      next: (response) => {
        this.assignedUserProfileUrl = response.url;
        console.log(`[TicketDetails] Assigned user profile picture URL loaded:`, response.url);
        this.cdr.detectChanges();
      },
      error: () => {
        console.error(`[TicketDetails] Failed to load assigned user profile picture for userId ${assignedUserId}`);
        this.assignedUserProfileUrl = null;
      }
    });
  }

  loadTicketHistory(): void {
    this.ticketService.getTicketHistory(this.ticketId).subscribe({
      next: (history) => {
        this.historyGroups = history;
        this.latestHistoryGroup = this.getLatestHistoryGroup(history);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  loadTicketAttachments(): void {
    this.attachmentService.getAttachmentsForTicket(this.ticketId).subscribe({
      next: (attachments) => {
        this.attachments = attachments;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  get recentHistoryGroups(): ITicketHistoryGroup[] {
    return [...this.historyGroups]
      .sort((a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime())
      .slice(0, 3);
  }

  private getLatestHistoryGroup(history: ITicketHistoryGroup[]): ITicketHistoryGroup | null {
    if (!history.length) return null;

    return history.reduce((latest, current) => {
      const latestDate = new Date(latest.changedAt).getTime();
      const currentDate = new Date(current.changedAt).getTime();
      return currentDate > latestDate ? current : latest;
    });
  }

  get latestHistoryPrimaryChange(): ITicketHistoryRead | null {
    if (!this.latestHistoryGroup?.changes?.length) return null;
    return this.latestHistoryGroup.changes[0];
  }

  getHistorySummaryForGroup(group: ITicketHistoryGroup): string {
    if (!group?.changes?.length) {
      return 'A change was recorded for this ticket.';
    }

    const primaryChange = group.changes[0];
    if (this.isCreationChange(primaryChange)) {
      return 'Ticket created in the system.';
    }

    if (group.changes.length > 1) {
      const fields = group.changes
        .slice(0, 2)
        .map(change => this.getDisplayFieldName(change.fieldName))
        .join(', ');
      const remaining = group.changes.length - 2;
      return remaining > 0
        ? `Multiple changes: ${fields} and ${remaining} more.`
        : `Multiple changes: ${fields}.`;
    }

    const field = this.getDisplayFieldName(primaryChange.fieldName);
    const oldValue = this.getDisplayValue(primaryChange.fieldName, primaryChange.oldValue);
    const newValue = this.getDisplayValue(primaryChange.fieldName, primaryChange.newValue);

    if (this.hasValue(oldValue) && this.hasValue(newValue)) {
      return `${field} changed from "${oldValue}" to "${newValue}".`;
    }

    if (this.hasValue(newValue)) {
      return `${field} set to "${newValue}".`;
    }

    if (this.hasValue(oldValue)) {
      return `${field} removed (was "${oldValue}").`;
    }

    return `${field} was updated.`;
  }

  getHistoryDotClass(group: ITicketHistoryGroup): string {
    switch (this.getHistoryHighlightType(group)) {
      case 'created':
        return 'bg-sky-500';
      case 'closed':
        return 'bg-emerald-500';
      case 'reopened':
        return 'bg-rose-500';
      case 'assigned':
        return 'bg-indigo-500';
      default:
        return 'bg-brand-primary';
    }
  }

  private getHistoryHighlightType(group: ITicketHistoryGroup): 'created' | 'closed' | 'reopened' | 'assigned' | null {
    for (const change of group.changes ?? []) {
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

  get latestHistorySummary(): string {
    if (!this.latestHistoryGroup) {
      return 'No changes recorded yet for this ticket.';
    }

    const primaryChange = this.latestHistoryPrimaryChange;
    if (!primaryChange) {
      return 'A change was recorded for this ticket.';
    }

    if (this.isCreationChange(primaryChange)) {
      return 'A new ticket was created in the system.';
    }

    if (this.latestHistoryGroup.changes.length > 1) {
      const fields = this.latestHistoryGroup.changes
        .slice(0, 3)
        .map(change => this.getDisplayFieldName(change.fieldName))
        .join(', ');
      const remaining = this.latestHistoryGroup.changes.length - 3;
      return remaining > 0
        ? `Multiple properties changed: ${fields} and ${remaining} more.`
        : `Multiple properties changed: ${fields}.`;
    }

    const field = this.getDisplayFieldName(primaryChange.fieldName);
    const oldValue = this.getDisplayValue(primaryChange.fieldName, primaryChange.oldValue);
    const newValue = this.getDisplayValue(primaryChange.fieldName, primaryChange.newValue);

    if (this.hasValue(oldValue) && this.hasValue(newValue)) {
      return `${field} changed from "${oldValue}" to "${newValue}".`;
    }

    if (this.hasValue(newValue)) {
      return `${field} set to "${newValue}".`;
    }

    if (this.hasValue(oldValue)) {
      return `${field} removed (was "${oldValue}").`;
    }

    return `${field} was updated.`;
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

    return value!;
  }

  isCreationChange(change: ITicketHistoryRead): boolean {
    return change.fieldName?.toLowerCase() === 'ticket created';
  }

  hasValue(value: string | null | undefined): boolean {
    return value !== null && value !== undefined && value !== '';
  }

  closeTicket(): void {
    this.ticketService.resolveATicket(this.ticketId).subscribe({
      next: () => {
        location.reload();
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

  reopenTicket(): void {
    this.ticketService.reopenATicket(this.ticketId).subscribe({
      next: () => {
        location.reload();
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

  closeCommentsModal(): void {
    this.isCommentsModalOpen = false;
  }

  scrollToBottom(delay = 50): void {
    setTimeout(() => {
      try {
        if (this.commentsScrollContainer) {
          this.commentsScrollContainer.nativeElement.scrollTop = this.commentsScrollContainer.nativeElement.scrollHeight;
        }
      } catch (err) { }
    }, delay);
  }

  checkIfIsAUserComment(userCommentId: string): boolean {
    return this.authService.getCurrentUserId() === userCommentId;
  }

  openCloseTicketConfirmDialog() {
    this.closeTicketConfirmDialogOpen.set(true);
  }

  handleCloseTicketConfirm() {
    this.closeTicketConfirmDialogOpen.set(false);
    this.closeTicket();
  }

  openReopenTicketConfirmDialog() {
    this.closeReopenTicketConfirmDialogOpen.set(true);
  }

  handleReopenTicketConfirm() {
    this.closeReopenTicketConfirmDialogOpen.set(false);
    this.reopenTicket();
  }

  openAttachmentConfirm(attachment: ITicketAttachment): void {
    this.selectedAttachment = attachment;
    this.attachmentConfirmDialogOpen.set(true);
  }

  closeAttachmentConfirm(): void {
    this.attachmentConfirmDialogOpen.set(false);
    this.selectedAttachment = null;
  }

  handleAttachmentConfirm(): void {
    if (!this.selectedAttachment) {
      this.closeAttachmentConfirm();
      return;
    }

    this.storageService.getFileUrl(StorageBucket.TicketAttachments, this.selectedAttachment.filePath).subscribe({
      next: (response) => {
        this.triggerDownload(response.url, this.selectedAttachment?.fileName ?? 'attachment');
        this.closeAttachmentConfirm();
      },
      error: (error) => {
        console.log(`Bucket: ${StorageBucket.TicketAttachments}, Path: ${this.selectedAttachment?.filePath}`);
        console.error(error);
      }
    });
  }

  private triggerDownload(url: string, fileName: string): void {
    window.open(url, '_blank', 'noopener');
  }

  isUserAdminOrAgent(): boolean {
    return this.currentUserInfo?.role === 'Admin' || this.currentUserInfo?.role === 'Agent';
  }

  canEditTicket(): boolean {
    const isAdmin = this.currentUserInfo?.role === 'Admin';
    if (isAdmin) return true;

    if (this.ticketData?.closedAt) return false;

    const isAssignedAgent = this.currentUserInfo?.role === 'Agent' && this.ticketData.assignedToUserId === this.currentUserInfo?.userId;
    const isCreator = this.ticketData.createdByUserId === this.currentUserInfo?.userId;
    return isAssignedAgent || isCreator;
  }

  canResolveTicket(): boolean {
    const isAdminWithAcceptedTicket = this.currentUserInfo?.role === 'Admin' && !!this.ticketData.assignedToUserId;
    const isAssignedAgent = this.currentUserInfo?.role === 'Agent' && this.ticketData.assignedToUserId === this.currentUserInfo?.userId;
    return isAdminWithAcceptedTicket || isAssignedAgent;
  }

  canAssignToMe(): boolean {
    return this.currentUserInfo?.role === 'Agent' && !this.ticketData.assignedToUserId;
  }

  canAdminAcceptTicket(): boolean {
    return this.currentUserInfo?.role === 'Admin' && !this.ticketData.assignedToUserId;
  }

  assignTicketToMe(): void {
    this.ticketService.assignTicketToMe(this.ticketId).subscribe({
      next: () => {
        location.reload();
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

  goBack(): void {
    this.breadcrumbService.goBack('/ticket-main');
  }

  switchCommentTab(tab: 'public' | 'internal'): void {
    this.activeCommentTab = tab;
  }

  openCommentsModal(): void {
    this.isCommentsModalOpen = true;
    setTimeout(() => this.scrollToBottom(80), 150);
  }

  getAssigneeName(): string {
    if (!this.ticketData.assignedToUserId) {
      return 'TBD';
    }

    if (this.ticketData.assignedToUserId === this.currentUserInfo?.userId) {
      return 'Me';
    }

    return this.ticketData.assignedToUser ?? 'TBD';
  }

  getAssigneeInitials(): string {
    if (!this.ticketData.assignedToUserId) {
      return 'TBD';
    }

    const name = this.ticketData.assignedToUserId === this.currentUserInfo?.userId
      ? this.currentUserInfo?.fullName
      : this.ticketData.assignedToUser;

    return this.getInitials(name);
  }

  getInitials(fullName: string | null | undefined): string {
    if (!fullName) {
      return 'U';
    }

    return fullName
      .split(' ')
      .filter(Boolean)
      .map((namePart) => namePart[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
}