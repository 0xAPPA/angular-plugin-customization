import { Component } from '@angular/core';
import { DataTableComponent } from './data-table.component';

@Component({
  selector: 'app-root',
  imports: [DataTableComponent],
  template: `
    <div class="container">
      <h1>Approach 1: DI Plugin Registry</h1>
      <div class="info-banner">
        <h3>What is customized?</h3>
        <p>The <strong>context menu</strong> on the data table is extended by two customer plugins:</p>
        <ul>
          <li><strong>Export Plugin</strong> — adds an "Export Row" action to every row</li>
          <li><strong>Flag Plugin</strong> — adds a "Flag for Review" action (only visible on rows with "pending" status)</li>
        </ul>
        <h3>How to interact</h3>
        <p><strong>Right-click any table row</strong> to open the context menu and see the plugin-provided actions. Try right-clicking rows with different statuses — the Flag action is conditionally visible.</p>
      </div>
      <app-data-table />
    </div>
  `,
  styles: [`
    .container { max-width: 720px; margin: 40px auto; font-family: system-ui, sans-serif; }
    h1 { margin-bottom: 4px; }
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
    code { background: #f0f0f0; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
  `],
})
export class AppComponent {}
