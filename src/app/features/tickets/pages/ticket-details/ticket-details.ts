import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit, ElementRef, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowLeft, heroSparkles, heroDocument, heroChatBubbleLeftRight, heroPaperClip } from '@ng-icons/heroicons/outline';
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

@Component({
  selector: 'app-ticket-details',
  imports: [CommonModule, ButtonComponent, NgIcon, Label, RouterLink, FormsModule, ConfirmDialog, ModalComponent],
  viewProviders: [provideIcons({ heroArrowLeft, heroSparkles, heroDocument, heroChatBubbleLeftRight, heroPaperClip })],
  templateUrl: './ticket-details.html',
  styleUrl: './ticket-details.css',
})
export class TicketDetails implements OnInit, OnDestroy {
  private readonly resizeAnimationMs = 320;
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private ticketService = inject(TicketService);
  private authService = inject(AuthenticationService);
  private ticketCommentService = inject(TicketCommentService);
  private signalRService = inject(SignalRService);
  private breadcrumbService = inject(BreadcrumbService);
  private commentSubscription?: Subscription;

  ticketId: string = "";
  ticketData: IReadTickets = {} as IReadTickets;
  currentUserInfo: ICurrentUserInfo | null = this.authService.getCurrentUserInfo();

  ticketsComments: ITicketsReadComment[] = [];
  ticketCommentsNotInternal: ITicketsReadComment[] = [];
  ticketCommentsInternal: ITicketsReadComment[] = [];

  commentContentNotInternal: string = "";
  commentContentInternal: string = "";
  isInternal: boolean = false;
  isCommentsModalOpen: boolean = false;
  isInternalCommentsModalOpen: boolean = false;

  closeTicketConfirmDialogOpen = signal(false);
  closeReopenTicketConfirmDialogOpen = signal(false);
  private hasLoadedCommentsOnce = false;
  
  get recentCommentsNotInternal(): ITicketsReadComment[] {
    return this.ticketCommentsNotInternal.slice(-4);
  }

  get recentCommentsInternal(): ITicketsReadComment[] {
    return this.ticketCommentsInternal.slice(-2);
  }

  @ViewChild('publicCommentsCard') private publicCommentsCard?: ElementRef<HTMLElement>;
  @ViewChild('internalCommentsCard') private internalCommentsCard?: ElementRef<HTMLElement>;
  @ViewChild('commentsScrollContainer') private commentsScrollContainer?: ElementRef<HTMLElement>;
  @ViewChild('internalCommentsScrollContainer') private internalCommentsScrollContainer?: ElementRef<HTMLElement>;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.ticketId = params.get('ticketId')!;
    })
    this.loadTicketDetails();
    this.loadTicketComments();
    
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

  private getResizableContainers(): HTMLElement[] {
    const containers = [
      this.publicCommentsCard?.nativeElement,
      this.internalCommentsCard?.nativeElement,
      this.commentsScrollContainer?.nativeElement,
      this.internalCommentsScrollContainer?.nativeElement,
    ];

    return containers.filter((container): container is HTMLElement => !!container);
  }

  private captureHeights(containers: HTMLElement[]): Map<HTMLElement, number> {
    const heights = new Map<HTMLElement, number>();

    for (const container of containers) {
      heights.set(container, container.getBoundingClientRect().height);
    }

    return heights;
  }

  private animateContainerResize(previousHeights: Map<HTMLElement, number>): void {
    if (!previousHeights.size) {
      return;
    }

    requestAnimationFrame(() => {
      for (const [container, previousHeight] of previousHeights) {
        const nextHeight = container.getBoundingClientRect().height;

        if (Math.abs(nextHeight - previousHeight) < 1) {
          continue;
        }

        container.style.height = `${previousHeight}px`;
        container.style.overflow = 'hidden';
        container.style.transition = 'none';
        void container.offsetHeight;

        container.style.transition = `height ${this.resizeAnimationMs}ms cubic-bezier(0.22, 1, 0.36, 1)`;
        container.style.height = `${nextHeight}px`;

        window.setTimeout(() => {
          container.style.height = '';
          container.style.overflow = '';
          container.style.transition = '';
        }, this.resizeAnimationMs + 50);
      }
    });
  }

  private applyCommentsState(comments: ITicketsReadComment[]): void {
    const shouldAnimateResize = this.hasLoadedCommentsOnce;
    const containers = shouldAnimateResize ? this.getResizableContainers() : [];
    const previousHeights = shouldAnimateResize ? this.captureHeights(containers) : new Map<HTMLElement, number>();

    this.ticketsComments = comments;
    this.ticketCommentsNotInternal = this.ticketsComments.filter(comment => !comment.isInternal);
    this.ticketCommentsInternal = this.ticketsComments.filter(comment => comment.isInternal);
    this.cdr.detectChanges();

    if (shouldAnimateResize) {
      this.animateContainerResize(previousHeights);
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
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
      }
    })
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

  openCommentsModal(): void {
    if (this.ticketCommentsNotInternal.length > 4) {
      this.isCommentsModalOpen = true;
      setTimeout(() => this.scrollToBottom(80), 150);
    }
  }

  closeCommentsModal(): void {
    this.isCommentsModalOpen = false;
  }

  openInternalCommentsModal(): void {
    if (this.ticketCommentsInternal.length > 2) {
      this.isInternalCommentsModalOpen = true;
      setTimeout(() => this.scrollToBottom(80), 150);
    }
  }

  closeInternalCommentsModal(): void {
    this.isInternalCommentsModalOpen = false;
  }

  scrollToBottom(delay = 50): void {
    setTimeout(() => {
      try {
        if (this.isCommentsModalOpen && this.commentsScrollContainer) {
          this.commentsScrollContainer.nativeElement.scrollTop = this.commentsScrollContainer.nativeElement.scrollHeight;
        }
        if (this.isInternalCommentsModalOpen && this.internalCommentsScrollContainer) {
          this.internalCommentsScrollContainer.nativeElement.scrollTop = this.internalCommentsScrollContainer.nativeElement.scrollHeight;
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
}