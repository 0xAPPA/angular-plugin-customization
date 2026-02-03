import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-custom-status-cell',
  standalone: true,
  template: `
    <span class="pill" [class]="'pill pill-' + data">
      {{ data }}
    </span>
  `,
  styles: [`
    .pill {
      display: inline-block;
      padding: 2px 10px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
      text-transform: capitalize;
    }
    .pill-completed { background: #d1fae5; color: #065f46; }
    .pill-pending   { background: #fef3c7; color: #92400e; }
    .pill-cancelled { background: #fee2e2; color: #991b1b; }
    .pill-shipped   { background: #dbeafe; color: #1e40af; }
  `],
})
export class CustomStatusCellComponent {
  @Input() data = '';
}
