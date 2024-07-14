import { NgModule } from '@angular/core';
import { ɵSharedStylesHost } from '@angular/platform-browser';
import { CustomDomSharedStylesHost } from './custom_shared_styles_host';

@NgModule({
  providers: [
    { provide: ɵSharedStylesHost, useClass: CustomDomSharedStylesHost },
    { provide: 'APP_ID', useValue: 'my-app' }, // Provide the app ID
  ],
})
export class InlineStylesCSPModule {}
