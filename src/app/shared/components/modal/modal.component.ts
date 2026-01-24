import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconButton } from '../icon-button/icon-button';

@Component({
    selector: 'app-modal',
    standalone: true,
    imports: [CommonModule, IconButton],
    templateUrl: './modal.component.html',
})
export class ModalComponent {
    @Input() isOpen: boolean = false;
    @Input() title: string = '';
    @Input() size: 'sm' | 'md' | 'lg' | 'xl' | 'full' = 'md';
    @Input() closeOnOverlayClick: boolean = true;
    @Input() showCloseButton: boolean = true;

    @Output() close = new EventEmitter<void>();

    // Prevent body scroll when modal is open
    @Input() set lockScroll(value: boolean) {
        if (typeof window !== 'undefined') {
            if (value) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        }
    }

    ngOnChanges() {
        // Sync body scroll with isOpen state if not manually handled
        this.lockScroll = this.isOpen;
    }

    ngOnDestroy() {
        // Ensure scroll is restored when component is destroyed
        if (typeof window !== 'undefined') {
            document.body.style.overflow = '';
        }
    }

    @HostListener('document:keydown.escape')
    onEscape() {
        if (this.isOpen) {
            this.closeModal();
        }
    }

    closeModal() {
        this.close.emit();
    }

    onOverlayClick(event: MouseEvent) {
        if (this.closeOnOverlayClick && (event.target as HTMLElement).classList.contains('modal-overlay')) {
            this.closeModal();
        }
    }

    get maxWidthClass(): string {
        switch (this.size) {
            case 'sm': return 'max-w-md';
            case 'md': return 'max-w-lg';
            case 'lg': return 'max-w-2xl';
            case 'xl': return 'max-w-4xl';
            case 'full': return 'max-w-full mx-4';
            default: return 'max-w-lg';
        }
    }
}
