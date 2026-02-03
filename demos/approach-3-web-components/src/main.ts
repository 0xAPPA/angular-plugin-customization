import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { registerCustomElements } from './app/register-custom-elements';

// Register vanilla web components BEFORE Angular bootstrap
registerCustomElements();

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
