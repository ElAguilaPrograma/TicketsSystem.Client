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

@Component({
  selector: 'app-ticket-details',
  imports: [CommonModule, ButtonComponent, NgIcon, Label, RouterLink, FormsModule, ConfirmDialog],
  viewProviders: [provideIcons({ heroArrowLeft, heroSparkles, heroDocument, heroChatBubbleLeftRight, heroPaperClip })],
  templateUrl: './ticket-details.html',
  styleUrl: './ticket-details.css',
})
export class TicketDetails implements OnInit, OnDestroy {
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
  ticketData: IReadTickets = {} as IReadTickets; // tambien se puede poner { title = '' } y asi para inicializar todas las propiedades
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
  
  get recentCommentsNotInternal(): ITicketsReadComment[] {
    return this.ticketCommentsNotInternal.slice(-4);
  }

  get recentCommentsInternal(): ITicketsReadComment[] {
    return this.ticketCommentsInternal.slice(-2);
  }

  @ViewChild('commentsScrollContainer') private commentsScrollContainer?: ElementRef;
  @ViewChild('internalCommentsScrollContainer') private internalCommentsScrollContainer?: ElementRef;

  isCommentsModalAnimating: boolean = false;
  isInternalCommentsModalAnimating: boolean = false;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.ticketId = params.get('ticketId')!;
    })
    console.log("currentUserId", this.authService.getCurrentUserId());
    this.loadTicketDetails();
    this.loadTicketComments();
    
    this.commentSubscription = this.signalRService.ticketComment$.subscribe(newComment => {
      if (newComment.ticketId === this.ticketId) {
        if (!this.ticketsComments.some(c => c.commentId === newComment.commentId)) {
          this.ticketsComments.push(newComment);
          this.ticketCommentsNotInternal = this.ticketsComments.filter(comment => !comment.isInternal);
          this.ticketCommentsInternal = this.ticketsComments.filter(comment => comment.isInternal);
          this.cdr.detectChanges();
        this.scrollToBottom();
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
        this.ticketsComments = response;
        this.ticketCommentsNotInternal = this.ticketsComments.filter(comment => !comment.isInternal);
        this.ticketCommentsInternal = this.ticketsComments.filter(comment => comment.isInternal);
        this.cdr.detectChanges();
        this.scrollToBottom();
        console.log("ticketsComments", this.ticketsComments);
        console.log("ticketCommentsNotInternal", this.ticketCommentsNotInternal);
        console.log("ticketCommentsInternal", this.ticketCommentsInternal);
      },
      error: (error) => console.error(error)
    });
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
        console.log(this.ticketData);
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
      this.cdr.detectChanges(); 
      setTimeout(() => {
        this.isCommentsModalAnimating = true;
        this.cdr.detectChanges(); 
        this.scrollToBottom();
      }, 50); 
    }
  }

  closeCommentsModal(): void {
    this.isCommentsModalAnimating = false;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.isCommentsModalOpen = false;
      this.cdr.detectChanges();
    }, 200);
  }

  openInternalCommentsModal(): void {
    if (this.ticketCommentsInternal.length > 2) {
      this.isInternalCommentsModalOpen = true;
      this.cdr.detectChanges();
      setTimeout(() => {
        this.isInternalCommentsModalAnimating = true;
        this.cdr.detectChanges();
        this.scrollToBottom();
      }, 50);
    }
  }

  closeInternalCommentsModal(): void {
    this.isInternalCommentsModalAnimating = false;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.isInternalCommentsModalOpen = false;
      this.cdr.detectChanges();
    }, 200);
  }

  scrollToBottom(): void {
    setTimeout(() => {
      try {
        if (this.isCommentsModalOpen && this.commentsScrollContainer) {
          this.commentsScrollContainer.nativeElement.scrollTop = this.commentsScrollContainer.nativeElement.scrollHeight;
        }
        if (this.isInternalCommentsModalOpen && this.internalCommentsScrollContainer) {
          this.internalCommentsScrollContainer.nativeElement.scrollTop = this.internalCommentsScrollContainer.nativeElement.scrollHeight;
        }
      } catch (err) { }
    }, 50);
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

