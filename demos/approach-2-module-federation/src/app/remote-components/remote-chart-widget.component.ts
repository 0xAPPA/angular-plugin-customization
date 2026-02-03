import { Component } from '@angular/core';

/**
 * Simulated "remote" chart component.
 * In real Module Federation this would be exposed from a separate Angular app.
 */
@Component({
  selector: 'app-remote-chart-widget',
  standalone: true,
  template: `
    <div class="widget-card">
      <h3 class="widget-title">Remote Chart Widget <span class="badge">analytics-app</span></h3>
      <p class="widget-desc">Loaded at runtime from a federated remote.</p>
      <div class="chart">
        @for (bar of bars; track bar.label) {
          <div class="chart-row">
            <span class="chart-label">{{ bar.label }}</span>
            <div class="chart-bar-track">
              <div class="chart-bar" [style.width.%]="bar.value" [style.background]="bar.color"></div>
            </div>
            <span class="chart-value">{{ bar.value }}%</span>
          </div>
        }
      </div>
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
      background: #e3f2fd;
      color: #1565c0;
      padding: 2px 8px;
      border-radius: 12px;
      vertical-align: middle;
    }
    .widget-desc {
      margin: 0 0 14px;
      font-size: 13px;
      color: #777;
    }
    .chart { display: flex; flex-direction: column; gap: 10px; }
    .chart-row { display: flex; align-items: center; gap: 10px; }
    .chart-label {
      width: 50px;
      font-size: 13px;
      color: #555;
      text-align: right;
      flex-shrink: 0;
    }
    .chart-bar-track {
      flex: 1;
      height: 22px;
      background: #f0f0f0;
      border-radius: 4px;
      overflow: hidden;
    }
    .chart-bar {
      height: 100%;
      border-radius: 4px;
      transition: width 0.5s ease;
    }
    .chart-value {
      width: 40px;
      font-size: 13px;
      font-weight: 600;
      color: #333;
    }
  `]
})
export class RemoteChartWidgetComponent {
  bars = [
    { label: 'Q1', value: 72, color: '#1565c0' },
    { label: 'Q2', value: 85, color: '#2e7d32' },
    { label: 'Q3', value: 58, color: '#ef6c00' },
    { label: 'Q4', value: 93, color: '#6a1b9a' },
  ];
}
