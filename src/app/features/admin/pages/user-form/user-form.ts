import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowLeft } from '@ng-icons/heroicons/outline';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserAdminService } from '../../../../api/services/user-admin.service';
import { UserValidations } from '../../../../core/validations/user-validations.validator';

@Component({
  selector: 'app-user-form',
  imports: [CommonModule, ButtonComponent, NgIcon, RouterLink, ReactiveFormsModule],
  viewProviders: [provideIcons({ heroArrowLeft })],
  templateUrl: './user-form.html',
  styleUrl: './user-form.css',
})
export class UserForm {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private userAdminService = inject(UserAdminService);
  private userValidations = inject(UserValidations);

  createUserForm: FormGroup = this.fb.group({
    fullName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    role: ['user', [Validators.required, this.userValidations.validateRole()]],
    isActive: [true, [Validators.required]],
    password: ['', [Validators.required, this.userValidations.validatePassword()]],
    confirmPassword: ['', [Validators.required, this.userValidations.validateConfirmPassword()]]
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

}

