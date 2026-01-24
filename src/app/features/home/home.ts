import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroArrowRight, heroTicket, heroLockClosed, heroLockOpen } from '@ng-icons/heroicons/outline';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink, NgIconComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
  viewProviders: [provideIcons({ heroArrowRight, heroTicket, heroLockClosed, heroLockOpen })]
})
export class Home {
  public authService = inject(AuthService);

}
