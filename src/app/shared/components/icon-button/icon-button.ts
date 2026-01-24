import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-button',
  imports: [],
  templateUrl: './icon-button.html'
})
export class IconButton {
  @Input() label: string = '';
}
