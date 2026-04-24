import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-card',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './card.component.html',
})
export class CardComponent {
    @Input() title?: string;
    @Input() subtitle?: string;

    // Stat-card inputs
    @Input() label?: string;
    @Input() value?: string | number;
    @Input() valueClass: string = 'text-brand-text';

    // Optional styling overrides if needed
    @Input() class: string = '';
}
