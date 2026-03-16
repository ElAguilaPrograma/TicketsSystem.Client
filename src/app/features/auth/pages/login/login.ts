import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { Router, RouterLink } from "@angular/router";
import { AuthenticationService } from '../../../../api/services/authentication.service';

@Component({
  selector: 'app-login',
  imports: [CardComponent, ButtonComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private authenticationService = inject(AuthenticationService);
  private router = inject(Router);
  errorMessage: string = '';

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.authenticationService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          this.router.navigate(['/main']);
        },
        error: (err) => {
          this.errorMessage = err.error.error
          console.log('Login failed:', this.errorMessage);
          alert('Login failed: ' + (this.errorMessage || err.statusText || 'Unknown error'));
        }
      })
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }
}
