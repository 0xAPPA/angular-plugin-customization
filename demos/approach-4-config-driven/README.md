# Approach 4: Config-Driven UI

Customization via JSON configuration. No customer code needed -- all UI behavior controlled by a config object (theme, visible columns, feature toggles). Config can be loaded from API/DB and hot-swapped at runtime.

## Technique

Define config shape as a typed interface:

```ts
export interface AppConfig {
  theme: { primaryColor: string; fontFamily: string };
  table: {
    columns: { key: string; label: string; visible: boolean }[];
    showExportButton: boolean;
    showFilterBar: boolean;
    rowsPerPage: number;
  };
  features: { enableContextMenu: boolean; enableRowSelection: boolean };
}
```

Service holds config as Angular signal, components react automatically:

```ts
@Injectable({ providedIn: 'root' })
export class ConfigService {
  private readonly configSignal = signal<AppConfig>(DEFAULT_CONFIG);
  readonly config = this.configSignal.asReadonly();
  readonly visibleColumns = computed(() =>
    this.configSignal().table.columns.filter(c => c.visible)
  );

  loadConfig(config: AppConfig) { this.configSignal.set(config); }
}
```

Components bind to config signals:

```html
@if (config().table.showExportButton) {
  <button>Export</button>
}

@for (col of visibleColumns(); track col.key) {
  <th>{{ col.label }}</th>
}
```

Theme applied via CSS custom properties:

```html
<div [style.--primary]="config().theme.primaryColor">
```

## Customized Components

| Component | What's customized | Config keys |
|---|---|---|
| `ConfigTableComponent` | Visible columns | `table.columns[].visible` |
| `ConfigTableComponent` | Export button visibility | `table.showExportButton` |
| `ConfigTableComponent` | Filter bar visibility | `table.showFilterBar` |
| `ConfigTableComponent` | Rows per page | `table.rowsPerPage` |
| `ConfigTableComponent` | Right-click context menu | `features.enableContextMenu` |
| `ConfigTableComponent` | Row selection checkboxes | `features.enableRowSelection` |
| `ConfigTableComponent` | Theme color + font | `theme.primaryColor`, `theme.fontFamily` |

Everything is in one table component. The config controls what's shown and how it looks.

## How to Interact

1. **Click "Default Customer"** -- blue theme, all 5 columns (ID, Name, Email, Role, Status), export button, filter bar, context menu, row selection, 10 rows
2. **Click "Minimal Customer"** -- green monospace theme, only ID + Name columns, no export/filter/context menu/selection, 5 rows
3. **Type in the filter bar** (Default config) -- filters rows by visible column values
4. **Right-click the table** (Default config) -- context menu with View/Edit/Delete
5. **Click rows** (Default config) -- checkboxes toggle, row highlights
6. **Expand "Current Config JSON"** -- see the raw config object driving all UI state

## Run

```bash
npx ng serve
```
