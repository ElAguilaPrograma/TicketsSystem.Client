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

    // Optional styling overrides if needed
    @Input() class: string = '';
}
