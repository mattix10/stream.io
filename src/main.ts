import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { CSP_NONCE, importProvidersFrom } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { tokenInterceptor } from './app/core/interceptors/token-interceptor';

function getNonce(): string {
  const metaTag = document.querySelector('meta[name="CSP-NONCE"]');
  return metaTag ? (metaTag.getAttribute('content') as string) : '';
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([tokenInterceptor])),
    importProvidersFrom(
      BrowserAnimationsModule,
      ToastrModule.forRoot({
        timeOut: 3000,
        positionClass: 'toast-top-right',
        preventDuplicates: true,
      })
    ),

    {
      provide: CSP_NONCE,
      useValue: getNonce(),
    },
  ],
}).catch((err) => console.error(err));
