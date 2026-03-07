import { Component, Input, Output, EventEmitter, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface SelectOption {
  label: string;
  value: any;
  disabled?: boolean;
}

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './select.html',
  styleUrl: './select.css'
})
export class SelectComponent {
  @Input() options: SelectOption[] = [];
  @Input() selectedValue: any = null;
  @Input() placeholder: string = 'Seleccionar opción';
  @Input() label: string = '';
  @Input() disabled: boolean = false;
  @Input() variant: 'primary' | 'secondary' | 'outline' = 'primary';
  @Input() fullWidth: boolean = false;
  @Input() searchable: boolean = false;
  @Input() required: boolean = false;
  @Input() errorMessage: string = '';
  
  @Output() selectionChange = new EventEmitter<any>();
  
  @ViewChild('selectDropdown') selectDropdown!: ElementRef;
  
  isOpen = false;
  searchQuery = '';
  filteredOptions: SelectOption[] = [];

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.updateFilteredOptions();
  }

  ngOnChanges() {
    this.updateFilteredOptions();
  }

  toggleDropdown() {
    if (!this.disabled) {
      this.isOpen = !this.isOpen;
      this.searchQuery = '';
      this.updateFilteredOptions();
    }
  }

  selectOption(option: SelectOption) {
    if (!option.disabled) {
      this.selectedValue = option.value;
      this.selectionChange.emit(option.value);
      this.isOpen = false;
      this.searchQuery = '';
    }
  }

  updateFilteredOptions() {
    if (this.searchable && this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      this.filteredOptions = this.options.filter(option =>
        option.label.toLowerCase().includes(query)
      );
    } else {
      this.filteredOptions = this.options;
    }
  }

  onSearchInput(query: string) {
    this.searchQuery = query;
    this.updateFilteredOptions();
  }

  getSelectedLabel(): string {
    const selected = this.options.find(opt => opt.value === this.selectedValue);
    return selected ? selected.label : this.placeholder;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  get selectClasses(): string {
    const baseClasses = 'relative w-full';
    const widthClass = this.fullWidth ? '' : '';
    return `${baseClasses} ${widthClass}`;
  }

  get inputClasses(): string {
    const baseClasses = 'w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 border-2 focus:outline-none cursor-pointer flex items-center justify-between';
    
    let variantClasses = '';
    if (this.disabled) {
      variantClasses = 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed';
    } else {
      switch (this.variant) {
        case 'primary':
          variantClasses = 'bg-white dark:bg-gray-800 border-brand-border dark:border-gray-700 text-brand-text dark:text-white hover:border-brand-primary dark:hover:border-brand-primary focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 dark:focus:ring-offset-gray-900';
          break;
        case 'secondary':
          variantClasses = 'bg-white dark:bg-gray-800 border-brand-secondary dark:border-brand-secondary/50 text-brand-text dark:text-white hover:border-brand-secondary dark:hover:border-brand-secondary focus:ring-2 focus:ring-brand-secondary focus:ring-offset-2 dark:focus:ring-offset-gray-900';
          break;
        case 'outline':
          variantClasses = 'bg-transparent border-brand-primary text-brand-text dark:text-white hover:bg-brand-primary/5 dark:hover:bg-brand-primary/10 focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 dark:focus:ring-offset-gray-900';
          break;
      }
    }

    const errorClass = this.errorMessage ? 'border-red-500 dark:border-red-500' : '';
    
    return `${baseClasses} ${variantClasses} ${errorClass}`;
  }

  get dropdownClasses(): string {
    return 'absolute top-full left-0 w-full mt-2 bg-white dark:bg-gray-800 border-2 border-brand-border dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto';
  }
}

