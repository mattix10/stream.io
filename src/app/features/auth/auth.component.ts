import { Component, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, tap } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth-service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { LoginRequest } from './models/login-request';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  protected redirectLink: string = '';
}
