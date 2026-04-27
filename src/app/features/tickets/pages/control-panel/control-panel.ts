import { Component, OnInit, inject, DestroyRef, ChangeDetectorRef, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { CardComponent } from "../../../../shared/components/card/card.component";
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroSparkles, heroExclamationTriangle, heroChartBar, heroArrowTopRightOnSquare, heroXMark, heroTicket, heroClock, heroExclamationCircle, heroArrowRight, heroAdjustmentsHorizontal } from '@ng-icons/heroicons/outline';
import { TicketService } from '../../../../api/services/ticket.service';
import { SignalRService } from '../../../../api/services/signalR.service';
import { IReadTickets } from '../../../../api/interfaces/tickets/IReadTickets';
import { Router, RouterLink } from "@angular/router";
import { AuthenticationService } from '../../../../api/services/authentication.service';
import { getTimeAgo } from '../../../../core/helpers/get_time_ago';

@Component({
  selector: 'app-control-panel',
  imports: [CommonModule, ButtonComponent, CardComponent, NgIcon],
  viewProviders: [provideIcons({ heroSparkles, heroExclamationTriangle, heroChartBar, heroArrowTopRightOnSquare, heroXMark, heroTicket, heroClock, heroExclamationCircle, heroArrowRight, heroAdjustmentsHorizontal })],
  templateUrl: './control-panel.html',
  styleUrl: './control-panel.css',
})
export class ControlPanel implements OnInit {
  private router = inject(Router)
  private ticketService = inject(TicketService);
  private signalrService = inject(SignalRService);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);
  private authService = inject(AuthenticationService);

  todaysTicketsCount: number = 0;
  allTickets: IReadTickets[] = [];
  unassignedTickets: IReadTickets[] = [];
  assignedTickets: IReadTickets[] = [];

  isModalOpen = signal(false);
  modalAnimationState = signal(false);
  activeTab: 'unassigned' | 'assigned' = 'unassigned';
  isAdmin: boolean = false;

  ngOnInit() {
    this.loadTodaysCount();
    this.loadInitialLiveTickets();
    this.isAdmin = this.authService.getCurrentUserRole() === 'Admin';
    
    this.signalrService.newTicketToControlPanel$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((newTicket) => {
        if (!this.allTickets.some(t => t.ticketId === newTicket.ticketId)) {
          this.allTickets = [newTicket, ...this.allTickets]; 
          if (!newTicket.assignedToUser) {
            this.unassignedTickets = [newTicket, ...this.unassignedTickets];
          } else {
            this.assignedTickets = [newTicket, ...this.assignedTickets];
          }
          this.cdr.detectChanges();
        }
        this.loadTodaysCount();
      });
  }

  loadTodaysCount() {
    this.ticketService.getTodaysTicketsCount().subscribe({
      next: (count) => this.todaysTicketsCount = count,
      error: () => this.todaysTicketsCount = 0
    });
  }

  loadInitialLiveTickets() {
    this.ticketService.getTickets(1, 50, null, false, "All", "All", null, null, "", null).subscribe({
      next: (res) => {
        this.allTickets = res.data;
        this.unassignedTickets = res.data.filter(t => !t.assignedToUser); 
        this.assignedTickets = res.data.filter(t => t.assignedToUser); 
        console.log("Todos los tickets", this.allTickets);
        console.log("Tickets sin asignar", this.unassignedTickets);
        console.log("Tickets asignados", this.assignedTickets);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log("Error al cargar los tickets", err);
      }
    });
  }

  getPriorityColor(priority: string | null | undefined) {
    if(priority === 'Critical' || priority === 'Urgent') return 'bg-red-500/20 text-red-500';
    if(priority === 'High') return 'bg-orange-500/20 text-orange-500';
    if(priority === 'Medium') return 'bg-blue-500/20 text-blue-500';
    return 'bg-slate-500/20 text-slate-500';
  }

  getTimeAgo = getTimeAgo;

  openModal() {
    this.isModalOpen.set(true);
    setTimeout(() => this.modalAnimationState.set(true), 10);
    this.activeTab = 'unassigned';
  }

  closeModal() {
    this.modalAnimationState.set(false);
    setTimeout(() => {
      this.isModalOpen.set(false);
    }, 200);
  }

  switchTab(tab: 'unassigned' | 'assigned') {
    this.activeTab = tab;
  }

  refreshData() {
    this.loadInitialLiveTickets();
    this.loadTodaysCount();
    this.cdr.detectChanges();
  }

  navigateToDetails(ticketId: string) {
    this.router.navigate(['/ticket-details', ticketId]);
  }
}
