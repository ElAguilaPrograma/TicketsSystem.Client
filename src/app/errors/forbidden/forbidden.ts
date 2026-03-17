import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowSmallLeft, heroShieldExclamation } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-forbidden',
  imports: [RouterLink, ButtonComponent, CardComponent, NgIcon],
  viewProviders: [provideIcons({ heroArrowSmallLeft, heroShieldExclamation })],
  templateUrl: './forbidden.html',
  styleUrl: './forbidden.css',
})
export class Forbidden {

}
