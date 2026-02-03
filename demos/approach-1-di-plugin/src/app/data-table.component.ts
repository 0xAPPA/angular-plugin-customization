import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TABLE_CONTEXT_MENU,
  TableContextMenuProvider,
  TableContextMenuItem,
} from './plugin-contracts';

interface Row {
  id: number;
  name: string;
  status: string;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <table (document:click)="closeMenu()">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr
          *ngFor="let row of rows"
          (contextmenu)="onRightClick($event, row)"
        >
          <td>{{ row.id }}</td>
          <td>{{ row.name }}</td>
          <td>
            <span class="status" [class]="row.status">{{ row.status }}</span>
          </td>
        </tr>
      </tbody>
    </table>

    <div
      *ngIf="menuVisible"
      class="context-menu"
      [style.left.px]="menuX"
      [style.top.px]="menuY"
    >
      <button
        *ngFor="let item of menuItems"
        (click)="item.action(activeRow); closeMenu()"
      >
        <span *ngIf="item.icon" class="icon">{{ item.icon }}</span>
        {{ item.label }}
      </button>
      <div *ngIf="menuItems.length === 0" class="no-items">
        No actions available
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 10px 14px; text-align: left; border-bottom: 1px solid #e0e0e0; }
    th { background: #f5f5f5; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #555; }
    tr:hover { background: #f9f9f9; }
    tbody tr { cursor: context-menu; }
    .status { padding: 3px 10px; border-radius: 12px; font-size: 13px; font-weight: 500; }
    .status.active { background: #e6f4ea; color: #1e7e34; }
    .status.pending { background: #fff3e0; color: #e65100; }
    .status.inactive { background: #fce4ec; color: #c62828; }
    .context-menu {
      position: fixed;
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 6px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.12);
      padding: 4px 0;
      z-index: 1000;
      min-width: 180px;
    }
    .context-menu button {
      display: block; width: 100%; padding: 8px 16px;
      border: none; background: none; text-align: left;
      font-size: 14px; cursor: pointer;
    }
    .context-menu button:hover { background: #f0f0f0; }
    .icon { margin-right: 8px; }
    .no-items { padding: 8px 16px; color: #999; font-size: 13px; }
  `],
})
export class DataTableComponent {
  rows: Row[] = [
    { id: 1, name: 'Alice Johnson', status: 'active' },
    { id: 2, name: 'Bob Smith', status: 'pending' },
    { id: 3, name: 'Carol White', status: 'inactive' },
    { id: 4, name: 'Dave Brown', status: 'pending' },
    { id: 5, name: 'Eve Davis', status: 'active' },
  ];

  menuVisible = false;
  menuX = 0;
  menuY = 0;
  menuItems: TableContextMenuItem[] = [];
  activeRow: Row | null = null;

  constructor(
    @Inject(TABLE_CONTEXT_MENU)
    private contextMenuProviders: TableContextMenuProvider[]
  ) {}

  onRightClick(event: MouseEvent, row: Row): void {
    event.preventDefault();
    this.activeRow = row;
    this.menuX = event.clientX;
    this.menuY = event.clientY;

    // Gather items from all registered plugins
    this.menuItems = this.contextMenuProviders
      .flatMap((provider) => provider.getItems('main-table', row))
      .filter((item) => !item.visible || item.visible(row));

    this.menuVisible = true;
  }

  closeMenu(): void {
    this.menuVisible = false;
  }
}
