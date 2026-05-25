import { Component, inject, OnInit, signal, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
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
  heroSparkles,
  heroHome,
  heroRadio,
  heroBriefcase
} from '@ng-icons/heroicons/outline';
import { ConfirmDialog } from "../../shared/components/confirm-dialog/confirm-dialog";
import { DarkModeService } from '../../core/services/darkMode.service';
import { ICurrentUserInfo } from '../../api/interfaces/user/ICurrentUserInfo';
import { SidebarService } from '../../core/services/sidebar.service';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { heroCamera, heroTrash } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-sidebar',
  imports: [NgIcon, IconButton, ConfirmDialog, ButtonComponent, RouterLink, RouterLinkActive, ModalComponent],
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
      heroSparkles,
      heroHome,
      heroRadio,
      heroBriefcase,
      heroCamera,
      heroTrash
    }),
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit, OnDestroy {
  showConfirmDialog = signal(false);
  showProfilePicModal = signal(false);
  isUploadingProfilePic = signal(false);
  isRemovingProfilePic = signal(false);
  public authenticationService = inject(AuthenticationService);
  public darkModeService = inject(DarkModeService);
  public userInfo = signal<ICurrentUserInfo | null>(null);
  public sidebarService = inject(SidebarService);

  selectedProfileFile: File | null = null;
  profilePreviewUrl: string | null = null;
  profilePicError: string | null = null;
  private userInfoSubscription?: Subscription;

  ngOnInit(): void {
    this.getUserInfo();
  }

  ngOnDestroy(): void {
    this.revokePreviewUrl();
    this.userInfoSubscription?.unsubscribe();
  }

  openConfirmDialog() {
    this.showConfirmDialog.set(true);
  }

  openProfilePicModal() {
    this.profilePicError = null;
    this.selectedProfileFile = null;
    this.profilePreviewUrl = this.userInfo()?.profilePicUrl ?? null;
    this.showProfilePicModal.set(true);
  }

  closeProfilePicModal() {
    this.showProfilePicModal.set(false);
    this.profilePicError = null;
    this.selectedProfileFile = null;
    this.revokePreviewUrl();
    this.profilePreviewUrl = null;
  }

  private revokePreviewUrl(): void {
    if (this.profilePreviewUrl && this.profilePreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(this.profilePreviewUrl);
    }
  }

  handleConfirm() {
    this.showConfirmDialog.set(false);
    this.authenticationService.logout();
  }

  onProfileFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      this.profilePicError = 'Only PNG, JPEG, GIF, and WebP images are allowed.';
      this.selectedProfileFile = null;
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      this.profilePicError = 'File size must not exceed 5MB.';
      this.selectedProfileFile = null;
      return;
    }

    this.profilePicError = null;
    this.selectedProfileFile = file;

    this.revokePreviewUrl();
    this.profilePreviewUrl = URL.createObjectURL(file);
  }

  saveProfilePic() {
    if (!this.selectedProfileFile || this.isUploadingProfilePic()) {
      return;
    }

    const userId = this.authenticationService.getCurrentUserId();
    if (!userId) {
      return;
    }

    this.isUploadingProfilePic.set(true);
    this.authenticationService.uploadProfilePic(this.selectedProfileFile, userId).subscribe({
      next: () => {
        this.getUserInfo();
        this.isUploadingProfilePic.set(false);
        this.closeProfilePicModal();
      },
      error: () => {
        this.isUploadingProfilePic.set(false);
      }
    });
  }

  removeProfilePic() {
    if (this.isRemovingProfilePic()) {
      return;
    }

    const userId = this.authenticationService.getCurrentUserId();
    if (!userId) {
      return;
    }

    this.isRemovingProfilePic.set(true);
    this.authenticationService.removeProfilePic(userId).subscribe({
      next: () => {
        this.getUserInfo();
        this.isRemovingProfilePic.set(false);
        this.closeProfilePicModal();
      },
      error: () => {
        this.isRemovingProfilePic.set(false);
      }
    });
  }

  getInitials(fullName: string | null | undefined): string {
    if (!fullName) {
      return 'U';
    }

    return fullName
      .split(' ')
      .filter(Boolean)
      .map((namePart) => namePart[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  getUserInfo() {
    this.userInfoSubscription?.unsubscribe();
    this.userInfoSubscription = this.authenticationService.checkStatus$().subscribe({
      next: (res) => {
        this.userInfo.set(res);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
