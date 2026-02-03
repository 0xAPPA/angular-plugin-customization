import { Component } from '@angular/core';

@Component({
  selector: 'app-custom-toolbar',
  standalone: true,
  template: `
    <div class="toolbar">
      <button class="toolbar-btn" (click)="onExport()">Export CSV</button>
      <button class="toolbar-btn" (click)="onPrint()">Print</button>
    </div>
  `,
  styles: [`
    .toolbar {
      display: flex;
      gap: 8px;
      padding: 12px 0;
    }
    .toolbar-btn {
      padding: 6px 16px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      background: #fff;
      font-size: 13px;
      cursor: pointer;
      transition: background 0.15s;
    }
    .toolbar-btn:hover { background: #f3f4f6; }
  `],
})
export class CustomToolbarComponent {
  onExport(): void {
    alert('Export CSV clicked');
  }

  onPrint(): void {
    alert('Print clicked');
  }
}
