import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { RemoteComponentLoader } from './federation-types';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    RemoteComponentLoader,
  ],
};
