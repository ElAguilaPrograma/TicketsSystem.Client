import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowLeft, heroMagnifyingGlass, heroUserCircle, heroChevronDown } from '@ng-icons/heroicons/outline';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { TicketService } from '../../../../api/services/ticket.service';
import { IReadTickets } from '../../../../api/interfaces/tickets/IReadTickets';
import { AuthenticationService } from '../../../../api/services/authentication.service';
import { BreadcrumbService } from '../../../../core/services/breadcrumb.service';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { Searchbar } from '../../../../shared/components/searchbar/searchbar';
import { UserAdminService } from '../../../../api/services/user-admin.service';
import { IUser } from '../../../../api/interfaces/user/IUser';
import { IPagedResult } from '../../../../api/interfaces/IPagedResult';
import { Select } from '../../../../shared/components/select/select';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-ticket-edit',
  imports: [
    CommonModule, 
    ButtonComponent, 
    NgIcon, Select, 
    ReactiveFormsModule, 
    ModalComponent, 
    Searchbar],
  viewProviders: [provideIcons({ heroArrowLeft, heroMagnifyingGlass, heroUserCircle, heroChevronDown })],
  templateUrl: './ticket-edit.html',
  styleUrl: './ticket-edit.css',
})
export class TicketEdit implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private ticketService = inject(TicketService);
  private authService = inject(AuthenticationService);
  private breadcrumbService = inject(BreadcrumbService);
  private userAdminService = inject(UserAdminService);
  private cdr = inject(ChangeDetectorRef);

  ticketData: IReadTickets = {} as IReadTickets;
  currentUserRole: string | null = this.authService.getCurrentUserRole() ?? null;
  ticketId: string = "";

  statusOptions = [
    { label: 'Open', value: 1 },
    { label: 'In Progress', value: 2 },
    { label: 'On Hold', value: 3 },
    { label: 'Closed', value: 4 },
    { label: 'Reopened', value: 5 }
  ];

  priorityOptions = [
    { label: 'Critical', value: 4 },
    { label: 'High', value: 3 },
    { label: 'Medium', value: 2 },
    { label: 'Low', value: 1 }
  ];

  isAssignModalOpen = false;
  selectedAgentId: string | null = null;
  selectedAgentName: string = 'Unassigned';
  agents: IUser[] = [];
  agentSearchQuery = '';
  currentPage = 1;
  pageSize = 6;
  totalPages = 1;
  totalCount = 0;
  pageNumbers: number[] = [1];

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.ticketId = params.get('ticketId')!;
    });

    this.ticketService.getTicketById(this.ticketId).subscribe({
      next: (res) => {
        this.ticketData = res;
        this.updateTicketForm.patchValue({
          title: res.title,
          description: res.description,
          statusId: res.statusId,
          priorityId: res.priorityId,
          assignedToUserId: res.assignedToUserId ? res.assignedToUserId : null
        });
        if (res.assignedToUser) {
          this.selectedAgentName = res.assignedToUser;
        }
        if (res.assignedToUserId) {
          this.selectedAgentId = res.assignedToUserId;
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  updateTicketForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    statusId: [{ value: '', disabled: !this.isUserAdminOrAgent() }, Validators.required],
    priorityId: ['', Validators.required],
    assignedToUserId: [{ value: null, disabled: true }]
  });

  openAssignModal() {
    this.isAssignModalOpen = true;
    this.currentPage = 1;
    this.agentSearchQuery = '';
    const currentAssignedId = this.updateTicketForm.get('assignedToUserId')?.value;
    if (currentAssignedId) {
      this.selectedAgentId = currentAssignedId;
    }
    this.loadAgents();
  }

  closeAssignModal() {
    this.isAssignModalOpen = false;
  }

  loadAgents() {
    this.userAdminService.getUsers(this.currentPage, this.pageSize, 'Agent', 'Active', this.agentSearchQuery)
      .subscribe({
        next: (res: IPagedResult<IUser>) => {
          this.agents = res.data;
          this.totalCount = res.totalCount;
          this.totalPages = res.totalPages;
          this.currentPage = res.page;
          this.updatePageNumbers();
          console.log('[TicketEdit] Agents loaded successfully:', this.agents);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.log(err);
        }
      });
  }

  searchAgents(query: string) {
    this.agentSearchQuery = query;
    this.currentPage = 1;
    this.loadAgents();
  }

  selectAgentCard(agentId: string, agentName: string) {
    this.selectedAgentId = agentId;
    this.selectedAgentName = agentName;
  }

  confirmAssignment() {
    if (this.selectedAgentId) {
      this.updateTicketForm.patchValue({ assignedToUserId: this.selectedAgentId });
    } else {
      this.updateTicketForm.patchValue({ assignedToUserId: null });
    }
    this.isAssignModalOpen = false;
  }

  clearAssignment() {
    this.selectedAgentId = null;
    this.selectedAgentName = 'Unassigned';
    this.updateTicketForm.patchValue({ assignedToUserId: null });
  }

  getInitials(fullName: string): string {
    return fullName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.loadAgents();
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadAgents();
    }
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadAgents();
    }
  }

  updatePageNumbers() {
    this.pageNumbers = [];
    for (let i = 1; i <= this.totalPages; i++) {
      this.pageNumbers.push(i);
    }
  }

  onSubmit(): void {
    if (this.updateTicketForm.valid) {
      const payload = this.updateTicketForm.getRawValue();

      if (!this.isUserAdminOrAgent()) {
        payload.statusId = this.ticketData.statusId;

        this.ticketService.updateTicketUser(payload, this.ticketId).subscribe({
          next: () => {
            this.router.navigate(['/ticket-details', this.ticketId]);
          },
          error: (err) => {
            console.log(err);
          }
        });
      }
      else {
        this.ticketService.updateTicket(payload, this.ticketId).subscribe({
          next: () => {
            this.router.navigate(['/ticket-details', this.ticketId]);
          },
          error: (err) => {
            console.log(err);
          }
        });
      }
    }
  }

  isUserAdminOrAgent(): boolean {
    return this.currentUserRole === 'Admin' || this.currentUserRole === 'Agent';
  }

  isUserAgentAssigned(): boolean {
    return this.currentUserRole === 'Agent' && this.ticketData.assignedToUserId === this.authService.getCurrentUserId();
  }

  abandonTicket() {
    this.ticketService.abandonTicket(this.ticketId).subscribe({
      next: () => {
        this.router.navigate(['/ticket-details', this.ticketId]);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  goBack(): void {
    this.breadcrumbService.goBack(`/ticket-details/${this.ticketId}`);
  }
}