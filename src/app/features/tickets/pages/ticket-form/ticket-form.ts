import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowLeft, heroArrowUpOnSquare, heroPlus } from '@ng-icons/heroicons/outline';
import { Select } from "../../../../shared/components/select/select";
import { FormsModule, FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketService } from '../../../../api/services/ticket.service';
import { BreadcrumbService } from '../../../../core/services/breadcrumb.service';

@Component({
  selector: 'app-ticket-form',
  imports: [CommonModule, ButtonComponent, NgIcon, Select, FormsModule, ReactiveFormsModule],
  viewProviders: [provideIcons({ heroArrowLeft, heroArrowUpOnSquare, heroPlus })],
  templateUrl: './ticket-form.html',
  styleUrl: './ticket-form.css',
})
export class TicketForm implements OnInit, OnDestroy {
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

  readonly maxAttachments = 5;
  readonly maxFileSizeBytes = 25 * 1024 * 1024;
  attachmentError = '';
  attachments: File[] = [];
  attachmentPreviews: Array<{ name: string; sizeLabel: string; isImage: boolean; url?: string }> = [];

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
      const formData = new FormData();
      formData.append('title', this.createTicketForm.get('title')?.value ?? '');
      formData.append('description', this.createTicketForm.get('description')?.value ?? '');
      formData.append('priorityId', String(this.createTicketForm.get('priorityId')?.value ?? 1));

      for (const file of this.attachments) {
        formData.append('Attachments', file, file.name);
      }

      this.ticketService.createATicket(formData).subscribe({
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

  onAttachmentsSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const files = Array.from(input.files);
    this.attachmentError = '';

    for (const file of files) {
      if (this.attachments.length >= this.maxAttachments) {
        this.attachmentError = `Max ${this.maxAttachments} files per ticket.`;
        break;
      }

      if (file.size > this.maxFileSizeBytes) {
        this.attachmentError = `File "${file.name}" exceeds 25MB limit.`;
        continue;
      }

      this.attachments.push(file);
      this.attachmentPreviews.push(this.buildPreview(file));
    }

    input.value = '';
  }

  removeAttachment(index: number): void {
    const preview = this.attachmentPreviews[index];
    if (preview?.url) {
      URL.revokeObjectURL(preview.url);
    }

    this.attachmentPreviews.splice(index, 1);
    this.attachments.splice(index, 1);
  }

  ngOnDestroy(): void {
    for (const preview of this.attachmentPreviews) {
      if (preview.url) {
        URL.revokeObjectURL(preview.url);
      }
    }
  }

  private buildPreview(file: File): { name: string; sizeLabel: string; isImage: boolean; url?: string } {
    const isImage = file.type.startsWith('image/');
    const url = isImage ? URL.createObjectURL(file) : undefined;

    return {
      name: file.name,
      sizeLabel: this.formatFileSize(file.size),
      isImage,
      url
    };
  }

  private formatFileSize(bytes: number): string {
    const kb = bytes / 1024;
    if (kb < 1024) {
      return `${Math.max(1, Math.round(kb))} KB`;
    }

    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  }
}

