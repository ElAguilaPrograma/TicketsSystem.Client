import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "../header/header";

@Component({
  selector: 'app-alt-layout',
  imports: [RouterOutlet, Header],
  templateUrl: './alt-layout.html',
  styleUrl: './alt-layout.css',
})
export class AltLayout {

}
