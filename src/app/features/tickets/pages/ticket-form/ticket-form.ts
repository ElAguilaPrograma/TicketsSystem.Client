import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowLeft, heroArrowUpOnSquare } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-ticket-form',
  imports: [CommonModule, ButtonComponent, NgIcon],
  viewProviders: [provideIcons({ heroArrowLeft, heroArrowUpOnSquare })],
  templateUrl: './ticket-form.html',
  styleUrl: './ticket-form.css',
})
export class TicketForm {

}

