import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "../header/header";
import { Sidebar } from "../sidebar/sidebar";
import { SidebarService } from '../../core/services/sidebar.service';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Header, Sidebar],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  public sidebarService = inject(SidebarService);
}
