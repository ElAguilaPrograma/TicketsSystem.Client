import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroUserPlus, heroMagnifyingGlass, heroPencilSquare, heroTrash, heroPower, heroDocumentChartBar, heroUserGroup } from '@ng-icons/heroicons/outline';
import { Router } from '@angular/router';
import { UserAdminService } from '../../../../api/services/user-admin.service';
import { IUser } from '../../../../api/interfaces/user/IUser';
import { ConfirmDialog } from "../../../../shared/components/confirm-dialog/confirm-dialog";
import { FormsModule } from '@angular/forms';
import { IUserCount } from '../../../../api/interfaces/user/IUserCount';
import { Select } from '../../../../shared/components/select/select';
import { Searchbar } from "../../../../shared/components/searchbar/searchbar";
import { CardComponent } from '../../../../shared/components/card/card.component';
import { StorageBucket } from '../../../../core/enums/storage_bucket';
import { StorageService } from '../../../../api/services/storage.service';

@Component({
  selector: 'app-user-admin',
  imports: [CommonModule, ButtonComponent, NgIcon, ConfirmDialog, FormsModule, Select, Searchbar, CardComponent],
  viewProviders: [provideIcons({ heroUserPlus, heroMagnifyingGlass, heroPencilSquare, heroTrash, heroPower, heroDocumentChartBar, heroUserGroup })],
  templateUrl: './user-admin.html',
  styleUrl: './user-admin.css',
})
export class UserAdmin implements OnInit {
  private router = inject(Router);
  private userAdminService = inject(UserAdminService);
  private storageService = inject(StorageService);
  private cdr = inject(ChangeDetectorRef);

  users: IUser[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  disabledBotton: boolean = false;

  currentPage: number = 1;
  pageSize: number = 5;
  totalCount: number = 0;
  totalPages: number = 0;

  pageNumbers: number[] = [];

  isOpen = signal(false);
  showConfirmDialog = signal(false);
  selectedUserId: string = '';
  roleFilterSelected: string = 'All Roles';
  isActiveFilterSelected: string = 'All';
  querySearchSelected: string = '';
  usersCount: IUserCount = {} as IUserCount;

  roleOptions = [
    { label: 'All Roles', value: 'All Roles' },
    { label: 'Admin', value: 'Admin' },
    { label: 'Agent', value: 'Agent' },
    { label: 'User', value: 'User' }
  ];

  isActiveOptions = [
    { label: 'All', value: 'All' },
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' }
  ];

  ngOnInit(): void {
    this.loadUsers();
    this.loadUsersCount();
  }

  navigateToCreateUser() {
    this.router.navigate(['/user-form']);
  }

  setPageNumbers(): void {
    this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadUsers();
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadUsers();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadUsers();
    }
  }

  loadUsers(): void {
    this.isLoading = true;
    this.disabledBotton = true;
    this.userAdminService.getUsers(this.currentPage, this.pageSize, this.roleFilterSelected, this.isActiveFilterSelected, this.querySearchSelected).subscribe({
      next: (res) => {
        this.users = res.data;
        this.totalCount = res.totalCount;
        this.totalPages = res.totalPages;
        this.currentPage = res.page;
        this.setPageNumbers();
        this.isLoading = false;
        this.disabledBotton = false;

        for (let user of this.users) {
          if (user.profilePicPath){
            this.storageService.getUrlForProfilePic(StorageBucket.ProfilePics, user.profilePicPath).subscribe({
              next: (res) => {
                user.profilePicUrl = res.url
                console.log(`[UserAdmin] Profile picture URL loaded for user ${user.userId}:`, res.url);
              },
              error: (err) => console.error(`[UserAdmin] Error loading profile picture for user ${user.userId}:`, err)
            })
          }
        }


        this.cdr.detectChanges();

        console.log('[UserAdmin] Users loaded successfully:', this.users);
      },
      error: (err) => {
        this.errorMessage = 'Error loading users: ' + err;
        console.error('[UserAdmin] Error al cargar usuarios:', err);
        this.isLoading = false;
        this.disabledBotton = false;
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

  openConfirmDialog(): void {
    this.showConfirmDialog.set(true);
  }

  closeConfirmDialog(): void {
    this.showConfirmDialog.set(false);
    this.selectedUserId = '';
  }

  activateAndDeactivateUsers(userId: string) {
    this.userAdminService.activateAndDeactivateUsers(userId).subscribe({
      next: (res) => {
        this.loadUsers();
        this.closeConfirmDialog();
        console.log('[UserAdmin] User activated/deactivated successfully:', res);
      },
      error: (err) => {
        this.errorMessage = 'Error activating and deactivating user: ' + err;
        console.error('[UserAdmin] Error activating and deactivating user:', err);
      }
    });
  }

  searchUsers(query: string) {
    this.querySearchSelected = query;
    this.currentPage = 1;
    this.loadUsers();
  }

  loadUsersCount(): void {
    this.userAdminService.getUsersCount().subscribe({
      next: (res) => {
        this.usersCount = res;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'Error loading users count: ' + err;
        console.error('[UserAdmin] Error loading users count:', err);
      }
    });
  }

  exportUsers(): void {
    this.isLoading = true;
    this.disabledBotton = true;
    const timezoneOffsetMinutes = new Date().getTimezoneOffset();
    this.userAdminService.exportUsers(this.roleFilterSelected, this.isActiveFilterSelected, timezoneOffsetMinutes).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'users.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
        this.isLoading = false;
        this.disabledBotton = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'Error exporting users: ' + err;
        console.error('[UserAdmin] Error exporting users:', err);
        this.isLoading = false;
        this.disabledBotton = false;
        this.cdr.detectChanges();
      }
    });
  }

  navigateToEditUser(userId: string): void {
    this.router.navigate(['/user-edit-form', userId]);
  }
}
