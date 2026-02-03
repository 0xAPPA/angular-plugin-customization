import {
  ApplicationConfig,
  provideZoneChangeDetection,
  APP_INITIALIZER,
} from '@angular/core';
import { ExtensionRegistryService } from './extension-registry.service';

function registerExtensions(registry: ExtensionRegistryService): () => void {
  return () => {
    registry.register('table-header', () =>
      import('./extensions/custom-header-widget.component').then(
        (m) => m.CustomHeaderWidgetComponent
      )
    );

    registry.register('status-cell', () =>
      import('./extensions/custom-status-cell.component').then(
        (m) => m.CustomStatusCellComponent
      )
    );

    registry.register('table-toolbar', () =>
      import('./extensions/custom-toolbar.component').then(
        (m) => m.CustomToolbarComponent
      )
    );
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    {
      provide: APP_INITIALIZER,
      useFactory: registerExtensions,
      deps: [ExtensionRegistryService],
      multi: true,
    },
  ],
};
