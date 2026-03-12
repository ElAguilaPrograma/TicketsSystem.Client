import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowSmallLeft } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-unauthorized',
  imports: [RouterLink, ButtonComponent, NgIcon],
  viewProviders: [provideIcons({ heroArrowSmallLeft })],
  templateUrl: './unauthorized.html',
  styleUrl: './unauthorized.css',
})
export class Unauthorized {

}
