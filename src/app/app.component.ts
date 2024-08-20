import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Component, CSP_NONCE } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { TokenInterceptorService } from './core/interceptors/token-interceptor';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { RouterModule } from '@angular/router';

function getNonce(): string {
  const metaTag = document.querySelector('meta[name="CSP-NONCE"]');
  return metaTag ? (metaTag.getAttribute('content') as string) : '';
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    HttpClientModule,
    NavbarComponent,
    ReactiveFormsModule,
    ToastrModule,
    RouterModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    },
    {
      provide: CSP_NONCE,
      useValue: getNonce(),
    },
  ],
})
export class AppComponent {
  title = 'stream-io';
}
