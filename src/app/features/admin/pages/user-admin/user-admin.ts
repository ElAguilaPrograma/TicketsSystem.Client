import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroUserPlus, heroMagnifyingGlass, heroPencilSquare, heroTrash } from '@ng-icons/heroicons/outline';

import { Router } from '@angular/router';

@Component({
  selector: 'app-user-admin',
  imports: [CommonModule, ButtonComponent, NgIcon],
  viewProviders: [provideIcons({ heroUserPlus, heroMagnifyingGlass, heroPencilSquare, heroTrash })],
  templateUrl: './user-admin.html',
  styleUrl: './user-admin.css',
})
export class UserAdmin {
  private router = inject(Router);

  navigateToCreateUser() {
    this.router.navigate(['/user-form']);
  }
}

