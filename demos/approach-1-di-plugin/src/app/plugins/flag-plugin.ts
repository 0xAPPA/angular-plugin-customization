import { Injectable } from '@angular/core';
import { TableContextMenuProvider, TableContextMenuItem } from '../plugin-contracts';

@Injectable({ providedIn: 'root' })
export class FlagPlugin implements TableContextMenuProvider {
  getItems(_tableId: string, row: any): TableContextMenuItem[] {
    return [
      {
        label: 'Flag for Review',
        icon: '🚩',
        action: (r) => alert(`Flagged row for review: ${r.name}`),
        visible: (r) => r.status === 'pending',
      },
    ];
  }
}
