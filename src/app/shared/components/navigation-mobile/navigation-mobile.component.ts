import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { User } from 'src/app/core/models/user';

@Component({
  selector: 'app-navigation-mobile',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navigation-mobile.component.html',
  styleUrl: './navigation-mobile.component.scss',
})
export class NavigationMobileComponent {
  @Input() isUserAdmin = false;
  @Input() isContentCreator = false;
  @Input() user: User | null = null;
  @Output() toggleMobileMenuVisibilityChanged = new EventEmitter<void>();
  @Output() logoutChanged = new EventEmitter<void>();

  onLogout(): void {
    this.logoutChanged.emit();
  }
  readonly #breakpointMedium = 996;

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (window.innerWidth > this.#breakpointMedium) {
      this.toggleMobileVisibility();
    }
  }

  toggleMobileVisibility(): void {
    this.toggleMobileMenuVisibilityChanged.emit();
  }
}
