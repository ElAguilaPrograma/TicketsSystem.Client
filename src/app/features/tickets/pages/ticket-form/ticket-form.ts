import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowLeft, heroArrowUpOnSquare } from '@ng-icons/heroicons/outline';
import { Select } from "../../../../shared/components/select/select";
import { FormsModule, FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TicketService } from '../../../../api/services/ticket.service';

@Component({
  selector: 'app-ticket-form',
  imports: [CommonModule, ButtonComponent, NgIcon, Select, RouterLink, FormsModule, ReactiveFormsModule],
  viewProviders: [provideIcons({ heroArrowLeft, heroArrowUpOnSquare })],
  templateUrl: './ticket-form.html',
  styleUrl: './ticket-form.css',
})
export class TicketForm {
  private fb = inject(FormBuilder);
  private ticketService = inject(TicketService);
  private router = inject(Router);

  priorityOptions = [
    { label: 'Critical', value: 4 },
    { label: 'High', value: 3 },
    { label: 'Medium', value: 2 },
    { label: 'Low', value: 1 }
  ];

  createTicketForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    priorityId: [1, Validators.required],
  });

  onSubmit() {
    if (this.createTicketForm.valid) {
      this.ticketService.createATicket(this.createTicketForm.value).subscribe({
        next: () => {
          this.router.navigate(['/ticket-main']);
        },
        error: (error) => {
          console.error(error);
        }
      });
    }
  }
}

