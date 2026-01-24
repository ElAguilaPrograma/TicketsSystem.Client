import { Component, input, output, model, signal, effect } from '@angular/core';
import { ButtonComponent } from "../button/button.component";
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroExclamationTriangle } from '@ng-icons/heroicons/outline';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  imports: [ButtonComponent, NgIcon],
  viewProviders: [provideIcons({ heroExclamationTriangle })],
  templateUrl: './confirm-dialog.html'
})
export class ConfirmDialog {
  isOpen = model(false);
  animationState = signal(false);
  title = input('');
  message = input('');

  confirm = output<void>();
  cancel = output<void>();

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        setTimeout(() => this.animationState.set(true), 10);
      } else {
        this.animationState.set(false);
      }
    })
  }

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.animationState.set(false);
    setTimeout(() => {
      this.isOpen.set(false);
      this.cancel.emit();
    }, 200);
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.isOpen()) {
      this.onCancel();
    }
  }

  @HostListener('document:keydown.enter')
  onEnter() {
    if (this.isOpen()) {
      this.onConfirm();
    }
  }

}
