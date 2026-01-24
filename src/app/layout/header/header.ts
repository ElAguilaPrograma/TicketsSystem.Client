import { Component, inject, signal } from '@angular/core';
import { IconButton } from "../../shared/components/icon-button/icon-button";
import { NavigationEnd, RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { NgClass } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowRightEndOnRectangle } from '@ng-icons/heroicons/outline';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, filter, startWith } from 'rxjs'
import { Searchbar } from "../../shared/components/searchbar/searchbar";
import { DarkModeService } from '../../core/darkMode.service';

@Component({
  selector: 'app-header',
  imports: [IconButton, RouterModule, NgClass, NgIcon, Searchbar],
  viewProviders: [
    provideIcons({ heroArrowRightEndOnRectangle })
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  public darkModeService = inject(DarkModeService);
  public authService = inject(AuthService);
  private router = inject(Router);
  private events$ = this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    startWith(null),
    map(() => this.router.url === '/login')
  );
  public isLoginRoute = toSignal(this.events$, { initialValue: false });
  private eventsHome$ = this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    startWith(null),
    map(() => this.router.url === '/home')
  );
  public isHomeRoute = toSignal(this.eventsHome$, { initialValue: false });
  private eventsMain$ = this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    startWith(null),
    map(() => this.router.url === '/main')
  );
  public isMainRoute = toSignal(this.eventsMain$, { initialValue: false });
  public notificationsCount = signal(0);
  public searchValue = signal('');

  constructor() { }

  onSearchValueChange(value: string) {
    this.searchValue.set(value);
  }
}
