import { Injectable } from '@angular/core';
import { TableContextMenuProvider, TableContextMenuItem } from '../plugin-contracts';

@Injectable({ providedIn: 'root' })
export class ExportPlugin implements TableContextMenuProvider {
  getItems(_tableId: string, row: any): TableContextMenuItem[] {
    return [
      {
        label: 'Export Row',
        icon: '📤',
        action: (r) => alert(`Exporting row: ${JSON.stringify(r)}`),
      },
    ];
  }
}
