import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserAdminService } from '../../../../api/services/user-admin.service';
import { UserValidations } from '../../../../core/validations/user-validations.validator';
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { Select } from '../../../../shared/components/select/select';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { heroArrowLeft, heroLockClosed, heroEyeSlash } from '@ng-icons/heroicons/outline';
import { BreadcrumbService } from '../../../../core/services/breadcrumb.service';

@Component({
  selector: 'app-user-edit-form',
  imports: [ButtonComponent, NgIcon, Select, ReactiveFormsModule, ConfirmDialog],
  viewProviders: [provideIcons({ heroArrowLeft, heroLockClosed, heroEyeSlash })],
  templateUrl: './user-edit-form.html',
  styleUrl: './user-edit-form.css',
})
export class UserEditForm implements OnInit{
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private userAdminService = inject(UserAdminService);
  private userValidations = inject(UserValidations);
  private breadcrumbService = inject(BreadcrumbService);

  userId: string = "";
  editPassword: boolean = false;
  showPasswordDialog: boolean = false;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('userId')!;
    })

    this.userAdminService.getUserById(this.userId).subscribe({
      next: (response) => {
        this.updateUserForm.patchValue({
          fullName: response.fullName,
          email: response.email,
          role: response.role.charAt(0).toUpperCase() + response.role.slice(1),
          isActive: response.isActive
        });
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  statusOptions = [
    { label: 'Active', value: true },
    { label: 'Inactive', value: false }
  ];

  roleOptions = [
    { label: 'User', value: 'User' },
    { label: 'Agent', value: 'Agent' },
    { label: 'Administrator', value: 'Admin' }
  ];

  updateUserForm: FormGroup = this.fb.group({
    fullName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    role: ['User', [Validators.required, this.userValidations.validateRole()]],
    isActive: [true, [Validators.required]],
    password: ['', [this.userValidations.validatePassword()]],
    confirmPassword: ['', [this.userValidations.validateConfirmPassword()]]
  });

  enablePasswordEdit(): void {
    this.editPassword = true;
    this.showPasswordDialog = false;
    this.updateUserForm.get('password')?.setValidators([Validators.required, this.userValidations.validatePassword()]);
    this.updateUserForm.get('confirmPassword')?.setValidators([Validators.required, this.userValidations.validateConfirmPassword()]);
    this.updateUserForm.get('password')?.updateValueAndValidity();
    this.updateUserForm.get('confirmPassword')?.updateValueAndValidity();
  }

  hidePasswordFields(): void {
    this.editPassword = false;
    this.updateUserForm.get('password')?.reset('');
    this.updateUserForm.get('confirmPassword')?.reset('');
    this.updateUserForm.get('password')?.setValidators([this.userValidations.validatePassword()]);
    this.updateUserForm.get('confirmPassword')?.setValidators([this.userValidations.validateConfirmPassword()]);
    this.updateUserForm.get('password')?.updateValueAndValidity();
    this.updateUserForm.get('confirmPassword')?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.updateUserForm.valid) {
      this.userAdminService.updateUser(this.updateUserForm.value, this.userId).subscribe({
        next: (response) => {
          console.log('User updated successfully:', response);
          this.router.navigate(['/user-admin']);
        },
        error: (err) => {
          console.log(err);
        }
      });
    } else {
      this.updateUserForm.markAllAsTouched();
    }
  }

  goBack(): void {
    this.breadcrumbService.goBack('/user-admin');
  }
}
