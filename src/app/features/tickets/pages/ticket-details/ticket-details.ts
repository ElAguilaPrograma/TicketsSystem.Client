import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowLeft, heroSparkles, heroDocument, heroChatBubbleLeftRight, heroPaperClip } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-ticket-details',
  imports: [CommonModule, ButtonComponent, NgIcon],
  viewProviders: [provideIcons({ heroArrowLeft, heroSparkles, heroDocument, heroChatBubbleLeftRight, heroPaperClip })],
  templateUrl: './ticket-details.html',
  styleUrl: './ticket-details.css',
})
export class TicketDetails {

}

