import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowLeft, heroPencil, heroArrowRight, heroUser, heroPlus } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-ticket-change-history',
  imports: [CommonModule, ButtonComponent, NgIcon],
  viewProviders: [provideIcons({ heroArrowLeft, heroPencil, heroArrowRight, heroUser, heroPlus })],
  templateUrl: './ticket-change-history.html',
  styleUrl: './ticket-change-history.css',
})
export class TicketChangeHistory {

}

