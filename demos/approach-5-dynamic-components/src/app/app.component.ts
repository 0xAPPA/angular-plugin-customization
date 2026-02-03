import { Component } from '@angular/core';
import { DataTableComponent } from './data-table.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DataTableComponent],
  template: `
    <div class="app-shell">
      <h1>Approach 5: Dynamic Component Loading</h1>
      <div class="info-banner">
        <h3>What is customized?</h3>
        <p>Three <strong>named extension points</strong> in the data table are filled by customer-registered components:</p>
        <ul>
          <li><strong>table-header</strong> (above table) — customer's summary widget showing order counts and pending/completed breakdown</li>
          <li><strong>status-cell</strong> (per row) — customer's colored status pill replacing the default text</li>
          <li><strong>table-toolbar</strong> (below table) — customer's Export CSV and Print buttons</li>
        </ul>
        <h3>How to interact</h3>
        <p>All three extension points load automatically on page load (lazy-loaded chunks). Look <strong>above the table</strong> for the header widget, at the <strong>Status column</strong> for colored pills, and <strong>below the table</strong> for the toolbar buttons. Click "Export CSV" or "Print" in the toolbar to see the actions fire.</p>
      </div>
      <app-data-table />
    </div>
  `,
  styles: [`
    .app-shell {
      max-width: 720px;
      margin: 40px auto;
      font-family: system-ui, -apple-system, sans-serif;
    }
    h1 { margin: 0 0 12px; font-size: 22px; }
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
  `],
})
export class AppComponent {}
