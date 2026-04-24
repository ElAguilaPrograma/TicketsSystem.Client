import { Component, Input, Output, EventEmitter, HostListener, ElementRef, OnChanges, OnDestroy, SimpleChanges, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconButton } from '../icon-button/icon-button';

@Component({
    selector: 'app-modal',
    standalone: true,
    imports: [CommonModule, IconButton],
    templateUrl: './modal.component.html',
})
export class ModalComponent implements OnChanges, OnDestroy {
    private static openModalCount = 0;
    private hasRegisteredOpen = false;
    private lastFocusedElement: HTMLElement | null = null;
    private animationTimeout: ReturnType<typeof setTimeout> | null = null;

    @ViewChild('modalPanel') private modalPanel?: ElementRef<HTMLElement>;

    @Input() isOpen: boolean = false;
    @Input() title: string = '';
    @Input() size: 'sm' | 'md' | 'lg' | 'xl' | 'full' = 'md';
    @Input() closeOnOverlayClick: boolean = true;
    @Input() showCloseButton: boolean = true;
    @Input() showFooter: boolean = true;
    @Input() lockScroll: boolean = true;
    @Input() titleId: string = 'modal-title';
    @Input() closeButtonAriaLabel: string = 'Close modal';
    @Input() customHeader: boolean = false;
    @Input() scrollableBody: boolean = true;

    @Output() close = new EventEmitter<void>();

    isVisible = false;
    isAnimating = false;

    private cdr: ChangeDetectorRef;

    constructor(cdr: ChangeDetectorRef) {
        this.cdr = cdr;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['isOpen']) {
            if (this.isOpen) {
                this.show();
            } else {
                this.hide();
            }
        }
    }

    ngOnDestroy(): void {
        if (this.animationTimeout) {
            clearTimeout(this.animationTimeout);
            this.animationTimeout = null;
        }
        this.releaseOpenState();
    }

    private show(): void {
        if (this.isVisible) return;

        this.isVisible = true;
        this.isAnimating = false;
        this.cdr.detectChanges();

        this.animationTimeout = setTimeout(() => {
            this.isAnimating = true;
            this.cdr.detectChanges();
            this.registerOpenState();
        }, 50);
    }

    private hide(): void {
        if (!this.isVisible) return;
        if (!this.isAnimating) {
            this.isVisible = false;
            this.cdr.detectChanges();
            return;
        }

        this.isAnimating = false;
        this.cdr.detectChanges();

        this.animationTimeout = setTimeout(() => {
            this.isVisible = false;
            this.cdr.detectChanges();
            this.releaseOpenState();
        }, 300);
    }

    @HostListener('document:keydown.escape')
    onEscape(): void {
        if (this.isOpen) {
            this.closeModal();
        }
    }

    @HostListener('document:keydown', ['$event'])
    onTabPress(event: KeyboardEvent): void {
        if (!this.isOpen || event.key !== 'Tab') {
            return;
        }

        const panel = this.modalPanel?.nativeElement;
        if (!panel) {
            return;
        }

        const focusableElements = this.getFocusableElements(panel);
        if (focusableElements.length === 0) {
            event.preventDefault();
            panel.focus();
            return;
        }

        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];
        const activeElement = document.activeElement as HTMLElement | null;

        if (event.shiftKey && activeElement === first) {
            event.preventDefault();
            last.focus();
            return;
        }

        if (!event.shiftKey && activeElement === last) {
            event.preventDefault();
            first.focus();
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

    private registerOpenState(): void {
        if (this.hasRegisteredOpen) {
            return;
        }

        this.lastFocusedElement = document.activeElement as HTMLElement | null;

        if (this.lockScroll) {
            ModalComponent.openModalCount += 1;
            ModalComponent.updateBodyScroll();
        }

        this.hasRegisteredOpen = true;

        setTimeout(() => {
            const panel = this.modalPanel?.nativeElement;
            if (!panel) {
                return;
            }

            const focusableElements = this.getFocusableElements(panel);
            if (focusableElements.length > 0) {
                focusableElements[0].focus();
            } else {
                panel.focus();
            }
        }, 0);
    }

    private releaseOpenState(): void {
        if (!this.hasRegisteredOpen) {
            return;
        }

        if (this.lockScroll && ModalComponent.openModalCount > 0) {
            ModalComponent.openModalCount -= 1;
            ModalComponent.updateBodyScroll();
        }

        this.hasRegisteredOpen = false;

        if (this.lastFocusedElement) {
            this.lastFocusedElement.focus();
            this.lastFocusedElement = null;
        }
    }

    private getFocusableElements(root: HTMLElement): HTMLElement[] {
        const selectors = [
            'a[href]',
            'button:not([disabled])',
            'textarea:not([disabled])',
            'input:not([disabled])',
            'select:not([disabled])',
            '[tabindex]:not([tabindex="-1"])'
        ].join(',');

        return Array.from(root.querySelectorAll<HTMLElement>(selectors))
            .filter((element) => !element.hasAttribute('disabled') && element.getAttribute('aria-hidden') !== 'true');
    }

    private static updateBodyScroll(): void {
        if (typeof window === 'undefined') {
            return;
        }

        document.body.style.overflow = ModalComponent.openModalCount > 0 ? 'hidden' : '';
    }
}