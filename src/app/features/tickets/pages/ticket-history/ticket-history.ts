import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroEye } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-ticket-history',
  imports: [CommonModule, ButtonComponent, NgIcon],
  viewProviders: [provideIcons({ heroEye })],
  templateUrl: './ticket-history.html',
  styleUrl: './ticket-history.css',
})
export class TicketHistory {

}

