import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AuthService } from '../../../../core/auth.service';
import { Router, RouterLink } from "@angular/router";
import { AuthenticationService } from '../../../../api/services/authentication.service';
import { ILogin } from '../../../../api/interfaces/ILogin';

@Component({
  selector: 'app-login',
  imports: [CardComponent, ButtonComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private authenticationService = inject(AuthenticationService);
  private router = inject(Router);

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
        error: (error) => alert('Login failed: ' + (error.error?.message || error.statusText || 'Unknown error'))
      })
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  login() {
    this.authService.login();
  }
}
