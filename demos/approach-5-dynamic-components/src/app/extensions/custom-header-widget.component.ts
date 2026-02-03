import { Component } from '@angular/core';

@Component({
  selector: 'app-custom-header-widget',
  standalone: true,
  template: `
    <div class="header-widget">
      <span class="header-widget-title">Dashboard Summary</span>
      <span class="header-widget-stat">5 orders</span>
      <span class="header-widget-divider">|</span>
      <span class="header-widget-stat pending">2 pending</span>
      <span class="header-widget-divider">|</span>
      <span class="header-widget-stat completed">3 completed</span>
    </div>
  `,
  styles: [`
    .header-widget {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      background: #eef2ff;
      border: 1px solid #c7d2fe;
      border-radius: 8px;
      margin-bottom: 12px;
      font-size: 14px;
    }
    .header-widget-title {
      font-weight: 600;
      color: #3730a3;
      margin-right: 8px;
    }
    .header-widget-stat { color: #4338ca; }
    .header-widget-stat.pending { color: #d97706; }
    .header-widget-stat.completed { color: #059669; }
    .header-widget-divider { color: #a5b4fc; }
  `],
})
export class CustomHeaderWidgetComponent {}
