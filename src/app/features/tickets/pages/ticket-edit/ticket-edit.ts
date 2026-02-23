import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowLeft } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-ticket-edit',
  imports: [CommonModule, ButtonComponent, NgIcon],
  viewProviders: [provideIcons({ heroArrowLeft })],
  templateUrl: './ticket-edit.html',
  styleUrl: './ticket-edit.css',
})
export class TicketEdit {

}

