import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowSmallLeft, heroLockClosed } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-unauthorized',
  imports: [RouterLink, ButtonComponent, CardComponent, NgIcon],
  viewProviders: [provideIcons({ heroArrowSmallLeft, heroLockClosed })],
  templateUrl: './unauthorized.html',
  styleUrl: './unauthorized.css',
})
export class Unauthorized {

}
