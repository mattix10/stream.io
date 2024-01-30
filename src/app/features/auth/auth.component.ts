import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthRoutingModule } from './auth-routing.module';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [RouterModule, RouterOutlet],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {}
