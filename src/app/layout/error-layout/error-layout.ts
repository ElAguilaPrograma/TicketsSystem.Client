import { Component, inject } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { DarkModeService } from '../../core/darkMode.service';

@Component({
  selector: 'app-error-layout',
  imports: [RouterOutlet],
  templateUrl: './error-layout.html',
  styleUrl: './error-layout.css',
})
export class ErrorLayout {
  // Injecting the service to initialize the theme when this layout is loaded
  public darkModeService = inject(DarkModeService);
}
