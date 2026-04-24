import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-label',
  imports: [NgClass],
  templateUrl: './label.html',
  styleUrl: './label.css',
})
export class Label {
  @Input() label: string = '';
  @Input() variant: 'Low' | 'Medium' | 'High' | 'Critical' = 'Low';

  get variantClass() {
    switch (this.variant) {
      case 'Low':
        return 'bg-slate-500/20 text-slate-400 border border-slate-500/30';
      case 'Medium':
        return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      case 'High':
        return 'bg-orange-500/20 text-orange-400 border border-orange-500/30';
      case 'Critical':
        return 'bg-red-500/20 text-red-400 border border-red-500/30';
    }
  }
}
