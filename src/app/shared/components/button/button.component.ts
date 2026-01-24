import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon } from "@ng-icons/core";

@Component({
    selector: 'app-button',
    standalone: true,
    imports: [CommonModule, NgIcon],
    templateUrl: './button.component.html',
})
export class ButtonComponent {
    @Input() label: string = '';
    @Input() type: 'button' | 'submit' | 'reset' = 'button';
    @Input() variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' = 'primary';
    @Input() fullWidth: boolean = false;
    @Input() disabled: boolean = false;
    @Input() icon?: string; // name of the icon (e.g., PrimeIcons or arbitrary class)
    @Input() heroIcon?: string;

    @Output() onClick = new EventEmitter<Event>();

    get buttonClasses(): string {
        const baseClasses = 'inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

        let variantClasses = '';

        switch (this.variant) {
            case 'primary':
                variantClasses = 'bg-brand-primary text-white hover:bg-brand-primary/90 focus:ring-brand-primary shadow-lg shadow-brand-primary/30';
                break;
            case 'secondary':
                variantClasses = 'bg-brand-secondary text-white hover:bg-brand-secondary/90 focus:ring-brand-secondary shadow-lg shadow-brand-secondary/30';
                break;
            case 'outline':
                variantClasses = 'border-2 border-brand-primary text-brand-primary hover:bg-brand-primary/10 focus:ring-brand-primary';
                break;
            case 'ghost':
                variantClasses = 'text-brand-text hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors';
                break;
            case 'danger':
                variantClasses = 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 shadow-lg shadow-red-500/30';
                break;
        }

        const widthClass = this.fullWidth ? 'w-full' : '';

        return `${baseClasses} ${variantClasses} ${widthClass}`;
    }

    handleClick(event: Event) {
        if (!this.disabled) {
            this.onClick.emit(event);
        }
    }
}
