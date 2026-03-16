import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthenticationService } from '../../api/services/authentication.service';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { IconButton } from '../../shared/components/icon-button/icon-button';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  heroShieldCheck,
  heroTicket,
  heroUser,
  heroChartBar,
  heroCog6Tooth,
  heroArrowRightStartOnRectangle,
  heroMoon,
  heroSun,
  heroSparkles
} from '@ng-icons/heroicons/outline';
import { ConfirmDialog } from "../../shared/components/confirm-dialog/confirm-dialog";
import { DarkModeService } from '../../core/darkMode.service';
import { ICurrentUserInfo } from '../../api/interfaces/user/ICurrentUserInfo';

@Component({
  selector: 'app-sidebar',
  imports: [NgIcon, IconButton, ConfirmDialog, ButtonComponent, RouterLink, RouterLinkActive],
  viewProviders: [
    provideIcons({
      heroShieldCheck,
      heroTicket,
      heroUser,
      heroChartBar,
      heroCog6Tooth,
      heroArrowRightStartOnRectangle,
      heroMoon,
      heroSun,
      heroSparkles
    }),
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit {
  isOpen = signal(false);
  showConfirmDialog = signal(false);
  public authenticationService = inject(AuthenticationService);
  public darkModeService = inject(DarkModeService);
  public userInfo = signal<ICurrentUserInfo | null>(null);

  ngOnInit(): void {
    this.getUserInfo();
  }

  toggleSidebar() {
    this.isOpen.update((v) => !v);
  }

  openConfirmDialog() {
    this.showConfirmDialog.set(true);
  }

  handleConfirm() {
    this.showConfirmDialog.set(false);
    this.authenticationService.logout();
  }

  getUserInfo() {
    this.authenticationService.checkStatus$().subscribe({
      next: (res) => {
        this.userInfo.set(res);
        console.log(this.userInfo());
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
