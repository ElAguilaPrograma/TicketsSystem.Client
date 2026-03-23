import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { CardComponent } from "../../../../shared/components/card/card.component";
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroSparkles, heroExclamationTriangle, heroChartBar, heroArrowTopRightOnSquare } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-control-panel',
  imports: [CommonModule, ButtonComponent, CardComponent, NgIcon],
  viewProviders: [provideIcons({ heroSparkles, heroExclamationTriangle, heroChartBar, heroArrowTopRightOnSquare })],
  templateUrl: './control-panel.html',
  styleUrl: './control-panel.css',
})
export class ControlPanel {

}
