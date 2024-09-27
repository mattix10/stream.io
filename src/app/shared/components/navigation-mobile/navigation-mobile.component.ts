import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavigationDirective } from '../../navigation.directive';

@Component({
  selector: 'app-navigation-mobile',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navigation-mobile.component.html',
  styleUrl: './navigation-mobile.component.scss',
})
export class NavigationMobileComponent extends NavigationDirective {
  @Output() toggleMobileMenuVisibilityChanged = new EventEmitter<void>();

  readonly #breakpointMedium = 996;

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (window.innerWidth > this.#breakpointMedium) {
      this.toggleMobileMenuVisibility();
    }
  }

  toggleMobileMenuVisibility(): void {
    this.toggleMobileMenuVisibilityChanged.emit();
  }
}
