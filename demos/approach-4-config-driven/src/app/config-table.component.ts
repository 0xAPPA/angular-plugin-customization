import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { ConfigService } from './config.service';

interface RowData {
  [key: string]: string | number;
}

const SAMPLE_DATA: RowData[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Editor', status: 'Active' },
  { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'Viewer', status: 'Inactive' },
  { id: 4, name: 'Dan Brown', email: 'dan@example.com', role: 'Editor', status: 'Active' },
  { id: 5, name: 'Eve Davis', email: 'eve@example.com', role: 'Admin', status: 'Active' },
  { id: 6, name: 'Frank Lee', email: 'frank@example.com', role: 'Viewer', status: 'Inactive' },
  { id: 7, name: 'Grace Kim', email: 'grace@example.com', role: 'Editor', status: 'Active' },
  { id: 8, name: 'Hank Moore', email: 'hank@example.com', role: 'Viewer', status: 'Active' },
  { id: 9, name: 'Ivy Chen', email: 'ivy@example.com', role: 'Admin', status: 'Active' },
  { id: 10, name: 'Jack Wu', email: 'jack@example.com', role: 'Editor', status: 'Inactive' },
];

@Component({
  selector: 'app-config-table',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="table-wrapper"
         [style.--primary]="configService.config().theme.primaryColor"
         [style.font-family]="configService.config().theme.fontFamily">

      <div class="toolbar">
        @if (configService.config().table.showFilterBar) {
          <input class="filter-input"
                 placeholder="Filter rows..."
                 (input)="onFilter($event)" />
        }
        @if (configService.config().table.showExportButton) {
          <button class="export-btn" (click)="onExport()">Export CSV</button>
        }
      </div>

      <table (contextmenu)="onContextMenu($event)">
        <thead>
          <tr>
            @if (configService.config().features.enableRowSelection) {
              <th class="sel-col">Sel</th>
            }
            @for (col of configService.visibleColumns(); track col.key) {
              <th>{{ col.label }}</th>
            }
          </tr>
        </thead>
        <tbody>
          @for (row of displayedRows(); track row['id']) {
            <tr [class.selected]="selectedIds().has(row['id'])"
                (click)="toggleSelect(row)">
              @if (configService.config().features.enableRowSelection) {
                <td class="sel-col">
                  <input type="checkbox"
                         [checked]="selectedIds().has(row['id'])"
                         (click)="$event.stopPropagation()" />
                </td>
              }
              @for (col of configService.visibleColumns(); track col.key) {
                <td>{{ row[col.key] }}</td>
              }
            </tr>
          }
        </tbody>
      </table>

      @if (contextMenuVisible()) {
        <div class="context-menu"
             [style.left.px]="contextMenuX()"
             [style.top.px]="contextMenuY()">
          <button (click)="closeContextMenu()">View Details</button>
          <button (click)="closeContextMenu()">Edit Row</button>
          <button (click)="closeContextMenu()">Delete Row</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .table-wrapper {
      position: relative;
    }
    .toolbar {
      display: flex;
      gap: 8px;
      margin-bottom: 12px;
      min-height: 36px;
    }
    .filter-input {
      padding: 6px 12px;
      border: 2px solid var(--primary);
      border-radius: 4px;
      flex: 1;
      font-size: 14px;
    }
    .export-btn {
      padding: 6px 16px;
      background: var(--primary);
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th {
      background: var(--primary);
      color: white;
      padding: 10px 12px;
      text-align: left;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    td {
      padding: 8px 12px;
      border-bottom: 1px solid #e0e0e0;
      font-size: 14px;
    }
    tr:hover td {
      background: color-mix(in srgb, var(--primary) 8%, white);
    }
    tr.selected td {
      background: color-mix(in srgb, var(--primary) 18%, white);
    }
    .sel-col {
      width: 40px;
      text-align: center;
    }
    .context-menu {
      position: fixed;
      background: white;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1000;
      display: flex;
      flex-direction: column;
    }
    .context-menu button {
      padding: 8px 20px;
      border: none;
      background: none;
      text-align: left;
      cursor: pointer;
      font-size: 13px;
    }
    .context-menu button:hover {
      background: #f0f0f0;
    }
  `],
  host: {
    '(document:click)': 'closeContextMenu()',
  },
})
export class ConfigTableComponent {
  readonly configService = inject(ConfigService);

  private filterText = signal('');
  readonly selectedIds = signal<Set<string | number>>(new Set());
  readonly contextMenuVisible = signal(false);
  readonly contextMenuX = signal(0);
  readonly contextMenuY = signal(0);

  readonly displayedRows = () => {
    const filter = this.filterText().toLowerCase();
    const cols = this.configService.visibleColumns();
    const rowsPerPage = this.configService.config().table.rowsPerPage;

    let rows = SAMPLE_DATA;
    if (filter) {
      rows = rows.filter(row =>
        cols.some(col => String(row[col.key]).toLowerCase().includes(filter))
      );
    }
    return rows.slice(0, rowsPerPage);
  };

  onFilter(event: Event): void {
    this.filterText.set((event.target as HTMLInputElement).value);
  }

  onExport(): void {
    alert('Export triggered (simulated)');
  }

  toggleSelect(row: RowData): void {
    if (!this.configService.config().features.enableRowSelection) return;
    const id = row['id'];
    this.selectedIds.update(set => {
      const next = new Set(set);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  onContextMenu(event: MouseEvent): void {
    if (!this.configService.config().features.enableContextMenu) return;
    event.preventDefault();
    this.contextMenuX.set(event.clientX);
    this.contextMenuY.set(event.clientY);
    this.contextMenuVisible.set(true);
  }

  closeContextMenu(): void {
    this.contextMenuVisible.set(false);
  }
}
