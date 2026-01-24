import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { IconButton } from '../../shared/components/icon-button/icon-button';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  heroShieldCheck,
  heroTicket,
  heroUser,
  heroChartBar,
  heroCog6Tooth,
  heroArrowRightStartOnRectangle,
  heroMoon,
  heroSun,
} from '@ng-icons/heroicons/outline';
import { ConfirmDialog } from "../../shared/components/confirm-dialog/confirm-dialog";
import { DarkModeService } from '../../core/darkMode.service';

@Component({
  selector: 'app-sidebar',
  imports: [NgIcon, IconButton, ConfirmDialog, ButtonComponent],
  viewProviders: [
    provideIcons({
      heroShieldCheck,
      heroTicket,
      heroUser,
      heroChartBar,
      heroCog6Tooth,
      heroArrowRightStartOnRectangle,
      heroMoon,
      heroSun
    }),
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  isOpen = signal(false);
  showConfirmDialog = signal(false);
  public authService = inject(AuthService);
  public darkModeService = inject(DarkModeService);

  toggleSidebar() {
    this.isOpen.update((v) => !v);
  }

  openConfirmDialog() {
    this.showConfirmDialog.set(true);
  }

  handleConfirm() {
    this.showConfirmDialog.set(false);
    this.authService.logout();
  }
}
