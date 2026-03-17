import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { Router, RouterLink } from "@angular/router";
import { AuthenticationService } from '../../../../api/services/authentication.service';
import { ICurrentUserInfo } from '../../../../api/interfaces/user/ICurrentUserInfo';

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

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.authenticationService.login(this.loginForm.value).subscribe({
        next: (res) => {
          if (res?.role === 'Admin') {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/ticket-main']);
          }
        },
        error: (err) => {
          alert('Login failed: ' + (err.error.error || err.statusText || 'Unknown error'));
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
