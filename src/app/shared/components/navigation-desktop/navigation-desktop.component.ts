import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavigationDirective } from '../../navigation.directive';

@Component({
    selector: 'app-navigation-desktop',
    imports: [RouterLink],
    templateUrl: './navigation-desktop.component.html',
    styleUrl: './navigation-desktop.component.scss'
})
export class NavigationDesktopComponent extends NavigationDirective {}
