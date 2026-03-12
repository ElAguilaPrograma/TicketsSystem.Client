import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { heroArrowSmallLeft } from '@ng-icons/heroicons/outline';
import { NgIcon, provideIcons } from '@ng-icons/core';

@Component({
  selector: 'app-forbidden',
  imports: [RouterLink, ButtonComponent, NgIcon],
  viewProviders: [provideIcons({ heroArrowSmallLeft })],
  templateUrl: './forbidden.html',
  styleUrl: './forbidden.css',
})
export class Forbidden {

}
