import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  heroArrowPath,
  heroArrowUturnLeft,
  heroCheck,
  heroEnvelopeOpen,
  heroPause,
} from '@ng-icons/heroicons/outline';

type StatusTone = {
  chip: string;
  dot: string;
  icon: string;
  iconName: string;
};

@Component({
  selector: 'app-status-chip',
  standalone: true,
  imports: [CommonModule, NgIcon],
  viewProviders: [provideIcons({ heroCheck, heroArrowPath, heroPause, heroArrowUturnLeft, heroEnvelopeOpen })],
  templateUrl: './status-chip.html',
})
export class StatusChipComponent {
  @Input() status: string | null | undefined = '';
  @Input() variant: 'chip' | 'icon' = 'chip';
  @Input() size: 'xs' | 'sm' = 'xs';
  @Input() showDot: boolean = true;

  private readonly defaultTone: StatusTone = {
    chip: 'bg-slate-500/10 text-slate-300 border-slate-400/30',
    dot: 'bg-slate-400',
    icon: 'bg-slate-500/15 text-slate-300 ring-slate-400/35',
    iconName: 'heroEnvelopeOpen',
  };

  private readonly tones: Record<string, StatusTone> = {
    Open: {
      chip: 'bg-sky-500/10 text-sky-300 border-sky-400/30',
      dot: 'bg-sky-400',
      icon: 'bg-sky-500/15 text-sky-300 ring-sky-400/35',
      iconName: 'heroEnvelopeOpen',
    },
    InProgress: {
      chip: 'bg-amber-500/10 text-amber-300 border-amber-400/30',
      dot: 'bg-amber-400',
      icon: 'bg-amber-500/15 text-amber-300 ring-amber-400/35',
      iconName: 'heroArrowPath',
    },
    OnHold: {
      chip: 'bg-indigo-500/10 text-indigo-300 border-indigo-400/30',
      dot: 'bg-indigo-400',
      icon: 'bg-indigo-500/15 text-indigo-300 ring-indigo-400/35',
      iconName: 'heroPause',
    },
    Closed: {
      chip: 'bg-emerald-500/10 text-emerald-300 border-emerald-400/30',
      dot: 'bg-emerald-400',
      icon: 'bg-emerald-500/15 text-emerald-300 ring-emerald-400/35',
      iconName: 'heroCheck',
    },
    Reopened: {
      chip: 'bg-rose-500/10 text-rose-300 border-rose-400/30',
      dot: 'bg-rose-400',
      icon: 'bg-rose-500/15 text-rose-300 ring-rose-400/35',
      iconName: 'heroArrowUturnLeft',
    },
  };

  get statusLabel(): string {
    return this.status ?? 'Unknown';
  }

  get tone(): StatusTone {
    return this.tones[this.statusLabel] ?? this.defaultTone;
  }

  get chipClasses(): string {
    const sizeClass = this.size === 'sm'
      ? 'text-sm px-3 py-1 gap-1.5'
      : 'text-[11px] px-2 py-0.5 gap-1';

    return `inline-flex items-center rounded-full border font-medium ${sizeClass} ${this.tone.chip}`;
  }

  get iconClasses(): string {
    return `w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ring-1 ${this.tone.icon}`;
  }
}
