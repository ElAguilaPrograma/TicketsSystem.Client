import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowLeft } from '@ng-icons/heroicons/outline';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-form',
  imports: [CommonModule, ButtonComponent, NgIcon, RouterLink],
  viewProviders: [provideIcons({ heroArrowLeft })],
  templateUrl: './user-form.html',
  styleUrl: './user-form.css',
})
export class UserForm {

}

