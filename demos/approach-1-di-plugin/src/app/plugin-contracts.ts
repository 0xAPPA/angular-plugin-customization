import { InjectionToken } from '@angular/core';

export interface TableContextMenuItem {
  label: string;
  icon?: string;
  action: (row: any) => void;
  visible?: (row: any) => boolean;
}

export interface TableContextMenuProvider {
  getItems(tableId: string, row: any): TableContextMenuItem[];
}

export const TABLE_CONTEXT_MENU = new InjectionToken<TableContextMenuProvider[]>(
  'TABLE_CONTEXT_MENU',
  { factory: () => [] }
);
