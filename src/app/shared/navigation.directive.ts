import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../core/models/classes/user';

@Directive()
export class NavigationDirective {
  @Input() isUserAdmin = false;
  @Input() isContentCreator = false;
  @Input() user: User | null = null;

  @Output() logoutChanged = new EventEmitter<void>();

  onLogout(): void {
    this.logoutChanged.emit();
  }
}
