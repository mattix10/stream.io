import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { User } from 'src/app/core/models/classes/user';

@Component({
  selector: 'app-navigation-desktop',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navigation-desktop.component.html',
  styleUrl: './navigation-desktop.component.scss',
})
export class NavigationDesktopComponent {
  @Input() isUserAdmin = false;
  @Input() isContentCreator = false;
  @Input() user: User | null = null;

  @Output() logoutChanged = new EventEmitter<void>();

  onLogout(): void {
    this.logoutChanged.emit();
  }
}
