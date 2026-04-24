import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowLeft, heroArrowUpOnSquare } from '@ng-icons/heroicons/outline';
import { Select } from "../../../../shared/components/select/select";
import { FormsModule, FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketService } from '../../../../api/services/ticket.service';
import { BreadcrumbService } from '../../../../core/services/breadcrumb.service';

@Component({
  selector: 'app-ticket-form',
  imports: [CommonModule, ButtonComponent, NgIcon, Select, FormsModule, ReactiveFormsModule],
  viewProviders: [provideIcons({ heroArrowLeft, heroArrowUpOnSquare })],
  templateUrl: './ticket-form.html',
  styleUrl: './ticket-form.css',
})
export class TicketForm implements OnInit {
  private fb = inject(FormBuilder);
  private ticketService = inject(TicketService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private breadcrumbService = inject(BreadcrumbService);

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

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const title = params.get('title')?.trim();
      const description = params.get('description')?.trim();
      const priorityRaw = params.get('priorityId');
      const parsedPriority = Number(priorityRaw);
      const priorityId = Number.isInteger(parsedPriority) && parsedPriority >= 1 && parsedPriority <= 4
        ? parsedPriority
        : 1;

      this.createTicketForm.patchValue({
        title: title ?? '',
        description: description ?? '',
        priorityId,
      });
    });
  }

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

  goBack(): void {
    this.breadcrumbService.goBack('/ticket-main');
  }
}

