import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { TABLE_CONTEXT_MENU } from './plugin-contracts';
import { ExportPlugin } from './plugins/export-plugin';
import { FlagPlugin } from './plugins/flag-plugin';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    { provide: TABLE_CONTEXT_MENU, useClass: ExportPlugin, multi: true },
    { provide: TABLE_CONTEXT_MENU, useClass: FlagPlugin, multi: true },
  ],
};
