import { Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  heroCheckCircle,
  heroXCircle,
  heroExclamationTriangle,
  heroInformationCircle,
  heroXMark,
} from '@ng-icons/heroicons/outline';
import { ToastService } from '../../../core/services/toast.service';
import { ToastType } from './toast.types';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [NgIcon],
  viewProviders: [
    provideIcons({
      heroCheckCircle,
      heroXCircle,
      heroExclamationTriangle,
      heroInformationCircle,
      heroXMark,
    }),
  ],
  templateUrl: './toast.html',
  styleUrl: './toast.css',
})
export class ToastContainer {
  toastService = inject(ToastService);

  /** Returns the heroicon name for each toast type */
  iconName(type: ToastType): string {
    const map: Record<ToastType, string> = {
      success: 'heroCheckCircle',
      error: 'heroXCircle',
      warning: 'heroExclamationTriangle',
      info: 'heroInformationCircle',
    };
    return map[type];
  }

  /** Tailwind classes for the icon badge background */
  iconBgClass(type: ToastType): string {
    const map: Record<ToastType, string> = {
      success: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400',
      error: 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400',
      warning: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400',
      info: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400',
    };
    return map[type];
  }

  /** Accent border color */
  accentClass(type: ToastType): string {
    const map: Record<ToastType, string> = {
      success: 'border-l-emerald-500',
      error: 'border-l-red-500',
      warning: 'border-l-amber-500',
      info: 'border-l-blue-500',
    };
    return map[type];
  }

  dismiss(id: string): void {
    this.toastService.dismiss(id);
  }
}
