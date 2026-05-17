import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowLeft, heroUserPlus } from '@ng-icons/heroicons/outline';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserAdminService } from '../../../../api/services/user-admin.service';
import { UserValidations } from '../../../../core/validations/user-validations.validator';
import { Select } from '../../../../shared/components/select/select';
import { BreadcrumbService } from '../../../../core/services/breadcrumb.service';

@Component({
  selector: 'app-user-form',
  imports: [CommonModule, ButtonComponent, NgIcon, ReactiveFormsModule, Select],
  viewProviders: [provideIcons({ heroArrowLeft, heroUserPlus })],
  templateUrl: './user-form.html',
  styleUrl: './user-form.css',
})
export class UserForm {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private userAdminService = inject(UserAdminService);
  private userValidations = inject(UserValidations);
  private breadcrumbService = inject(BreadcrumbService);
  private cdk = inject(ChangeDetectorRef);

  statusOptions = [
    { label: 'Active', value: true },
    { label: 'Inactive', value: false }
  ];

  roleOptions = [
    { label: 'User', value: 'User' },
    { label: 'Agent', value: 'Agent' },
    { label: 'Administrator', value: 'Admin' }
  ];

  previewImage: string | null = null;

  get profilePicActionLabel(): string {
    return this.createUserForm.get('profilePic')?.value ? 'Change File' : 'Upload File';
  }

  createUserForm: FormGroup = this.fb.group({
    fullName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    role: ['User', [Validators.required, this.userValidations.validateRole()]],
    isActive: [true, [Validators.required]],
    password: ['', [Validators.required, this.userValidations.validatePassword()]],
    confirmPassword: ['', [Validators.required, this.userValidations.validateConfirmPassword()]],
    profilePic: [null, [this.userValidations.validateProfilePic()]]
  })

  onSubmit() {
    if (this.createUserForm.valid) {
      this.userAdminService.createUser(this.createUserForm.value).subscribe({
        next: (response) => {
          console.log('User created successfully:', response);
          this.router.navigate(['/user-admin']);
        },
        error: (err) => {
          console.log(err);
        }
      })
    } else {
      this.createUserForm.markAllAsTouched();
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      this.createUserForm.get('profilePic')?.setErrors({ 'invalidFileType': true });
      return;
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      this.createUserForm.get('profilePic')?.setErrors({ 'fileTooLarge': true });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target?.result as string;
      this.previewImage = base64String;
      this.createUserForm.get('profilePic')?.setValue(file);
      this.createUserForm.get('profilePic')?.setErrors(null);
      this.cdk.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  clearSelectedImage(fileInput: HTMLInputElement): void {
    fileInput.value = '';
    this.previewImage = null;

    const profilePicControl = this.createUserForm.get('profilePic');
    profilePicControl?.setValue(null);
    profilePicControl?.setErrors(null);
    profilePicControl?.markAsPristine();
    profilePicControl?.markAsUntouched();

    this.cdk.detectChanges();
  }

  goBack(): void {
    this.breadcrumbService.goBack('/user-admin');
  }

}

