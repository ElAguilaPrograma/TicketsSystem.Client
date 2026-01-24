import { Component } from '@angular/core';
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { CardComponent } from "../../../../shared/components/card/card.component";
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroExclamationCircle, 
  heroEllipsisHorizontal, 
  heroCheckCircle, 
  heroPlus } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-main',
  imports: [ButtonComponent, CardComponent, NgIcon],
  viewProviders: [
    provideIcons({
      heroExclamationCircle,
      heroEllipsisHorizontal,
      heroCheckCircle,
      heroPlus
    })
  ],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main {

}
