import { Component, Input, output, model } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroMagnifyingGlass, heroXMark } from '@ng-icons/heroicons/outline';
import { FormsModule } from '@angular/forms';
import { IconButton } from "../icon-button/icon-button";

@Component({
  selector: 'app-searchbar',
  imports: [NgIcon, FormsModule, IconButton],
  viewProviders: [provideIcons({ heroMagnifyingGlass, heroXMark })],
  templateUrl: './searchbar.html',
  styleUrl: './searchbar.css'
})
export class Searchbar {
  @Input() placeholder: string = 'Search...';
  @Input() width: string = 'full';

  searchValue = model<string>('');

  search = output<string>();

  onSearch() {
    this.search.emit(this.searchValue());
  }

  onClear() {
    this.searchValue.set('');
    this.search.emit('');
  }
}
