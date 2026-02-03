import {
  Component,
  ViewContainerRef,
  inject,
  ViewChildren,
  QueryList,
  AfterViewInit,
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ExtensionPointDirective } from './extension-point.directive';
import { ExtensionRegistryService } from './extension-registry.service';

interface Row {
  id: number;
  name: string;
  status: string;
  amount: number;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CurrencyPipe, ExtensionPointDirective],
  template: `
    <!-- Extension point: table-header (above table) -->
    <ng-container appExtensionPoint="table-header"></ng-container>

    <table class="data-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Status</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        @for (row of rows; track row.id) {
          <tr>
            <td>{{ row.id }}</td>
            <td>{{ row.name }}</td>
            <td>
              <!-- Extension point: status-cell (per row) -->
              <ng-container #statusCell></ng-container>
              @if (!hasStatusExtension) {
                <span class="fallback-status">{{ row.status }}</span>
              }
            </td>
            <td>{{ row.amount | currency }}</td>
          </tr>
        }
      </tbody>
    </table>

    <!-- Extension point: table-toolbar (below table) -->
    <ng-container appExtensionPoint="table-toolbar"></ng-container>
  `,
  styles: [`
    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
    }
    .data-table th, .data-table td {
      padding: 10px 14px;
      text-align: left;
      border-bottom: 1px solid #e5e7eb;
    }
    .data-table th {
      background: #f9fafb;
      font-weight: 600;
      color: #374151;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .data-table tbody tr:hover {
      background: #f9fafb;
    }
  `],
})
export class DataTableComponent implements AfterViewInit {
  private registry = inject(ExtensionRegistryService);

  @ViewChildren('statusCell', { read: ViewContainerRef })
  statusCells!: QueryList<ViewContainerRef>;

  hasStatusExtension = false;

  rows: Row[] = [
    { id: 1, name: 'Widget A', status: 'completed', amount: 29.99 },
    { id: 2, name: 'Widget B', status: 'pending',   amount: 49.99 },
    { id: 3, name: 'Gadget C', status: 'shipped',   amount: 19.50 },
    { id: 4, name: 'Gadget D', status: 'cancelled',  amount: 99.00 },
    { id: 5, name: 'Gizmo E',  status: 'pending',   amount: 14.75 },
  ];

  async ngAfterViewInit(): Promise<void> {
    const componentType = await this.registry.resolve('status-cell');
    if (!componentType) return;

    this.hasStatusExtension = true;

    this.statusCells.forEach((vcr, index) => {
      vcr.clear();
      const ref = vcr.createComponent(componentType);
      (ref.instance as Record<string, unknown>)['data'] = this.rows[index].status;
      ref.changeDetectorRef.detectChanges();
    });
  }
}
