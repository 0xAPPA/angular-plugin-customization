import { Component } from '@angular/core';
import { ConfigSwitcherComponent } from './config-switcher.component';
import { ConfigTableComponent } from './config-table.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ConfigSwitcherComponent, ConfigTableComponent],
  template: `
    <div class="shell">
      <h1>Approach 4: Config-Driven UI</h1>
      <div class="info-banner">
        <h3>What is customized?</h3>
        <p>The entire UI is controlled by a <strong>JSON configuration object</strong> — no customer code needed. The config controls:</p>
        <ul>
          <li><strong>Theme</strong> — primary color, font family</li>
          <li><strong>Table columns</strong> — which columns are visible</li>
          <li><strong>Features</strong> — export button, filter bar, context menu, row selection, rows per page</li>
        </ul>
        <h3>How to interact</h3>
        <p><strong>Click "Default Customer" or "Minimal Customer"</strong> buttons to hot-swap the config. Watch the table instantly change: columns appear/disappear, features toggle on/off, and the theme color changes. Expand "Current Config JSON" to see the raw config.</p>
      </div>
      <app-config-switcher />
      <app-config-table />
    </div>
  `,
  styles: [`
    .shell {
      max-width: 900px;
      margin: 0 auto;
      padding: 24px;
    }
    h1 {
      margin: 0 0 12px;
      font-size: 22px;
    }
    .info-banner {
      background: #f0f4ff;
      border: 1px solid #b3c6ff;
      border-left: 4px solid #3b82f6;
      border-radius: 6px;
      padding: 16px 20px;
      margin-bottom: 20px;
      font-size: 14px;
      line-height: 1.6;
      color: #1e293b;
    }
    .info-banner h3 { margin: 12px 0 6px; font-size: 15px; color: #1e40af; }
    .info-banner h3:first-child { margin-top: 0; }
    .info-banner p { margin: 0 0 6px; }
    .info-banner ul { margin: 4px 0 8px 20px; padding: 0; }
    .info-banner li { margin-bottom: 4px; }
  `],
})
export class AppComponent {}
