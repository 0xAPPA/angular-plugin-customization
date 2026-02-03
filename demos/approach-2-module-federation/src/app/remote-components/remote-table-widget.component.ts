import { Component } from '@angular/core';

/**
 * Simulated "remote" component.
 * In real Module Federation this would live in a separately built & deployed
 * Angular application and be exposed via the federation manifest.
 */
@Component({
  selector: 'app-remote-table-widget',
  standalone: true,
  template: `
    <div class="widget-card">
      <h3 class="widget-title">Remote Table Widget <span class="badge">customer-app</span></h3>
      <p class="widget-desc">Loaded at runtime from a federated remote.</p>
      <table class="widget-table">
        <thead>
          <tr><th>Customer</th><th>Plan</th><th>Status</th></tr>
        </thead>
        <tbody>
          <tr><td>Acme Corp</td><td>Enterprise</td><td class="status active">Active</td></tr>
          <tr><td>Globex Inc</td><td>Pro</td><td class="status active">Active</td></tr>
          <tr><td>Initech</td><td>Starter</td><td class="status inactive">Inactive</td></tr>
          <tr><td>Umbrella Ltd</td><td>Enterprise</td><td class="status active">Active</td></tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .widget-card {
      background: #fff;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }
    .widget-title {
      margin: 0 0 4px;
      font-size: 16px;
      color: #1a1a2e;
    }
    .badge {
      font-size: 11px;
      font-weight: 500;
      background: #e8f5e9;
      color: #2e7d32;
      padding: 2px 8px;
      border-radius: 12px;
      vertical-align: middle;
    }
    .widget-desc {
      margin: 0 0 14px;
      font-size: 13px;
      color: #777;
    }
    .widget-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
    }
    .widget-table th {
      text-align: left;
      padding: 8px 10px;
      background: #f5f5f5;
      border-bottom: 2px solid #e0e0e0;
      color: #555;
      font-weight: 600;
    }
    .widget-table td {
      padding: 8px 10px;
      border-bottom: 1px solid #eee;
    }
    .status {
      font-weight: 600;
      font-size: 12px;
    }
    .status.active { color: #2e7d32; }
    .status.inactive { color: #c62828; }
  `]
})
export class RemoteTableWidgetComponent {}
