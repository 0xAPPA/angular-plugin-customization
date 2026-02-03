import { Component } from '@angular/core';
import { HostTableComponent } from './host-table.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HostTableComponent],
  template: `
    <header>
      <h1>Approach 3: Web Components</h1>
      <div class="info-banner">
        <h3>What is customized?</h3>
        <p>Two parts of the UI are replaced by customer-built <strong>vanilla Web Components</strong> (no Angular dependency):</p>
        <ul>
          <li><strong>&lt;customer-status-badge&gt;</strong> — replaces the Status column cells with colored status pills</li>
          <li><strong>&lt;customer-info-panel&gt;</strong> — replaces the side panel detail view with a custom info card</li>
        </ul>
        <h3>How to interact</h3>
        <ul>
          <li><strong>Click a status badge</strong> in the Status column — fires a <code>CustomEvent</code> logged below</li>
          <li><strong>Click "Details"</strong> on any row — loads the customer info panel in the side panel</li>
          <li><strong>Click "Contact"</strong> in the side panel — fires a <code>contact-request</code> CustomEvent</li>
        </ul>
        <p>Watch the <strong>Event Log</strong> at the bottom to see all plugin-to-host communication.</p>
      </div>
    </header>
    <main>
      <app-host-table />
    </main>
  `,
  styles: [`
    header {
      padding: 24px 32px 0;
    }
    h1 { margin: 0 0 12px; font-size: 22px; }
    .info-banner {
      background: #f0f4ff;
      border: 1px solid #b3c6ff;
      border-left: 4px solid #3b82f6;
      border-radius: 6px;
      padding: 16px 20px;
      font-size: 14px;
      line-height: 1.6;
      color: #1e293b;
    }
    .info-banner h3 { margin: 12px 0 6px; font-size: 15px; color: #1e40af; }
    .info-banner h3:first-child { margin-top: 0; }
    .info-banner p { margin: 0 0 6px; }
    .info-banner ul { margin: 4px 0 8px 20px; padding: 0; }
    .info-banner li { margin-bottom: 4px; }
    .info-banner code { background: #e0e7ff; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
    main { padding: 24px 32px; }
  `],
})
export class AppComponent {}
