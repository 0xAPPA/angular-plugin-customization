# Approach 1: DI Plugin Registry

Customization via Angular's `InjectionToken` with `multi: true`. Plugins implement a typed interface and are registered as DI providers. The host component collects all registered plugins automatically.

## Technique

Define a contract interface + `InjectionToken`:

```ts
export interface TableContextMenuProvider {
  getItems(tableId: string, row: any): TableContextMenuItem[];
}

export const TABLE_CONTEXT_MENU = new InjectionToken<TableContextMenuProvider[]>(
  'TABLE_CONTEXT_MENU',
  { factory: () => [] }
);
```

Customer implements the interface:

```ts
@Injectable({ providedIn: 'root' })
export class ExportPlugin implements TableContextMenuProvider {
  getItems(_tableId: string, row: any): TableContextMenuItem[] {
    return [{ label: 'Export Row', action: (r) => alert(`Exporting: ${r.name}`) }];
  }
}
```

Register via `multi: true` in bootstrap config:

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    { provide: TABLE_CONTEXT_MENU, useClass: ExportPlugin, multi: true },
    { provide: TABLE_CONTEXT_MENU, useClass: FlagPlugin, multi: true },
  ],
};
```

Host component injects all providers as an array:

```ts
constructor(@Inject(TABLE_CONTEXT_MENU) private providers: TableContextMenuProvider[]) {}

getMenuItems(row: any) {
  return this.providers.flatMap(p => p.getItems('main-table', row));
}
```

## Customized Components

| Component | What's customized | By whom |
|---|---|---|
| `DataTableComponent` | Context menu items on right-click | `ExportPlugin`, `FlagPlugin` |

The table itself is the host component. It doesn't know which plugins exist -- it just injects `TABLE_CONTEXT_MENU` and iterates.

## How to Interact

1. **Right-click any row** -- context menu appears with items from all registered plugins
2. **Right-click a `pending` row** (Bob Smith, Dave Brown) -- both "Export Row" and "Flag for Review" appear
3. **Right-click an `active` or `inactive` row** -- only "Export Row" appears (FlagPlugin's `visible` predicate filters it out)
4. **Click a menu item** -- triggers an alert showing the action

## Run

```bash
npx ng serve
```
