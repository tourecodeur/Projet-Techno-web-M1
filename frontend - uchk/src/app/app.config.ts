import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import Material from '@primeng/themes/material';
import { routes } from './app.routes';
import { provideToastr } from 'ngx-toastr';
import { authInterceptor } from './core/interceptors/authInterceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(
        withInterceptors([authInterceptor]) 
    ),
    provideToastr(),
    providePrimeNG({
      theme: {
          preset: null
      }
    }),
  ]
};
