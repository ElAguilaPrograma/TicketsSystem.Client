import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { CardComponent } from "../../../../shared/components/card/card.component";
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  heroExclamationCircle,
  heroEllipsisHorizontal,
  heroCheckCircle,
  heroPlus,
  heroEllipsisVertical
} from '@ng-icons/heroicons/outline';

export interface Ticket {
  id: string;
  subject: string;
  reportedBy: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'Open' | 'In Progress' | 'Resolved';
  createdDate: string;
}

@Component({
  selector: 'app-main',
  imports: [CommonModule, ButtonComponent, CardComponent, NgIcon],
  viewProviders: [
    provideIcons({
      heroExclamationCircle,
      heroEllipsisHorizontal,
      heroCheckCircle,
      heroPlus,
      heroEllipsisVertical
    })
  ],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main {
    tickets: Ticket[] = [
    {
      id: 'INC-1024',
      subject: 'Server Latency in US-East-1 Region',
      reportedBy: 'Infrastructure Team',
      priority: 'CRITICAL',
      status: 'Open',
      createdDate: 'Oct 24, 2023 · 14:22'
    },
    {
      id: 'INC-1023',
      subject: 'VPN Authentication Failure',
      reportedBy: 'Sarah J. (Accounting)',
      priority: 'HIGH',
      status: 'In Progress',
      createdDate: 'Oct 24, 2023 · 12:45'
    },
    {
      id: 'INC-1022',
      subject: 'Printer Connection Issues - Floor 3',
      reportedBy: 'Facility Support',
      priority: 'LOW',
      status: 'Open',
      createdDate: 'Oct 24, 2023 · 09:12'
    },
    {
      id: 'INC-1021',
      subject: 'SaaS Integration Timeout',
      reportedBy: 'Automatic System Alert',
      priority: 'MEDIUM',
      status: 'Resolved',
      createdDate: 'Oct 23, 2023 · 16:55'
    }
  ];
}
