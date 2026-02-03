import { Component } from '@angular/core';
import { HostDashboardComponent } from './host-dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HostDashboardComponent],
  template: `
    <div class="shell">
      <header class="header">
        <h1>Approach 2: Module Federation <span class="sim">(Simulated)</span></h1>
      </header>
      <div class="info-banner">
        <h3>What is customized?</h3>
        <p>The <strong>dashboard widget area</strong> is extended by two customer-deployed remote components:</p>
        <ul>
          <li><strong>Table Widget</strong> — a customer orders table loaded from a remote app</li>
          <li><strong>Chart Widget</strong> — a revenue chart loaded from a different remote app</li>
        </ul>
        <h3>How to interact</h3>
        <p><strong>Click "Load Table Widget" or "Load Chart Widget"</strong> buttons to dynamically fetch and render remote components (simulated with 600ms delay). Click again to unload them. Widgets load independently and can be toggled on/off at runtime.</p>
      </div>
      <main>
        <app-host-dashboard />
      </main>
    </div>
  `,
  styles: [`
    .shell {
      max-width: 800px;
      margin: 0 auto;
      padding: 32px 20px;
    }
    .header {
      margin-bottom: 16px;
    }
    .header h1 {
      margin: 0;
      font-size: 22px;
      color: #1a1a2e;
    }
    .sim {
      font-size: 14px;
      font-weight: 400;
      color: #999;
    }
    .info-banner {
      background: #f0f4ff;
      border: 1px solid #b3c6ff;
      border-left: 4px solid #3b82f6;
      border-radius: 6px;
      padding: 16px 20px;
      margin-bottom: 24px;
      font-size: 14px;
      line-height: 1.6;
      color: #1e293b;
    }
    .info-banner h3 { margin: 12px 0 6px; font-size: 15px; color: #1e40af; }
    .info-banner h3:first-child { margin-top: 0; }
    .info-banner p { margin: 0 0 6px; }
    .info-banner ul { margin: 4px 0 8px 20px; padding: 0; }
    .info-banner li { margin-bottom: 4px; }
  `]
})
export class AppComponent {}
