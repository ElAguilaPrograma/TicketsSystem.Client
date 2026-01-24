import { Component, Input, output, model } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroMagnifyingGlass, heroXMark } from '@ng-icons/heroicons/outline';
import { FormsModule } from '@angular/forms';
import { IconButton } from "../icon-button/icon-button";

@Component({
  selector: 'app-searchbar',
  imports: [NgIcon, FormsModule, IconButton],
  viewProviders: [provideIcons({ heroMagnifyingGlass, heroXMark })],
  templateUrl: './searchbar.html'
})
export class Searchbar {
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() placeholder: string = 'Search tickets...';
  @Input() width: string = 'auto'; // Can be 'full', 'auto', or any CSS width value like '300px', '20rem', etc.

  searchValue = model<string>('');

  search = output<string>();

  get containerClasses(): string {
    const baseClasses = 'flex items-center gap-3 bg-brand-surface border border-brand-border rounded-lg transition-all duration-200 focus-within:ring-2 focus-within:ring-brand-primary/50 focus-within:border-brand-primary';

    let sizeClasses = '';

    switch (this.size) {
      case 'small':
        sizeClasses = 'px-3 py-2';
        break;
      case 'medium':
        sizeClasses = 'px-4 py-2.5';
        break;
      case 'large':
        sizeClasses = 'px-5 py-3';
        break;
    }

    const widthClass = this.width === 'full' ? 'w-full' : '';

    return `${baseClasses} ${sizeClasses} ${widthClass}`;
  }

  get inputClasses(): string {
    const baseClasses = 'flex-1 bg-transparent outline-none text-brand-text placeholder:text-brand-text-muted';

    let sizeClasses = '';

    switch (this.size) {
      case 'small':
        sizeClasses = 'text-sm';
        break;
      case 'medium':
        sizeClasses = 'text-base';
        break;
      case 'large':
        sizeClasses = 'text-lg';
        break;
    }

    return `${baseClasses} ${sizeClasses}`;
  }

  get iconClasses(): string {
    let sizeClasses = '';

    switch (this.size) {
      case 'small':
        sizeClasses = 'text-lg';
        break;
      case 'medium':
        sizeClasses = 'text-xl';
        break;
      case 'large':
        sizeClasses = 'text-2xl';
        break;
    }

    return `text-brand-text-muted ${sizeClasses}`;
  }

  onSearch() {
    this.search.emit(this.searchValue());
  }

  onClear() {
    this.searchValue.set('');
    this.search.emit('');
  }
}
