import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowLeft } from '@ng-icons/heroicons/outline';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { Select } from '../../../../shared/components/select/select';
import { FormsModule, FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { TicketService } from '../../../../api/services/ticket.service';
import { IReadTickets } from '../../../../api/interfaces/tickets/IReadTickets';
import { ICurrentUserInfo } from '../../../../api/interfaces/user/ICurrentUserInfo';
import { AuthenticationService } from '../../../../api/services/authentication.service';

@Component({
  selector: 'app-ticket-edit',
  imports: [CommonModule, ButtonComponent, NgIcon, RouterLink, Select, FormsModule, ReactiveFormsModule],
  viewProviders: [provideIcons({ heroArrowLeft })],
  templateUrl: './ticket-edit.html',
  styleUrl: './ticket-edit.css',
})
export class TicketEdit implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private ticketService = inject(TicketService);
  private authService = inject(AuthenticationService)
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

  // placeholder
  usersOptions = [
    { label: 'Unassigned', value: null },
    { label: 'John Doe (Support L1)', value: 1 },
    { label: 'Jane Smith (DevOps)', value: 2 }
  ];

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
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  updateTicketForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    statusId: [{ value: '', disabled: !this.isUserAdminOrAgent() }, Validators.required],
    priorityId: ['', Validators.required],
    assignedToUserId: [{ value: null, disabled: true }]
  });

  onSubmit(): void {
    if (this.updateTicketForm.valid) {
      if (!this.isUserAdminOrAgent()) {
        this.ticketService.updateTicketUser(this.updateTicketForm.value, this.ticketId).subscribe({
          next: () => {
            console.log("Ticket updated successfully");
            this.router.navigate(['/ticket-details', this.ticketId]);
          },
          error: (err) => {
            console.log(err);
          }
        });
      }
      else {
        this.ticketService.updateTicket(this.updateTicketForm.value, this.ticketId).subscribe({
          next: () => {
            console.log("Ticket updated successfully");
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
}

