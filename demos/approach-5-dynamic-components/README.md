# Approach 5: Dynamic Component Loading

Customization via named extension points using `ViewContainerRef`. A registry maps extension point names to lazy-loaded Angular components. Components are code-split into separate chunks and loaded on demand.

## Technique

Registry maps string names to lazy component loaders:

```ts
@Injectable({ providedIn: 'root' })
export class ExtensionRegistryService {
  private registry = new Map<string, () => Promise<Type<unknown>>>();

  register(name: string, loader: () => Promise<Type<unknown>>) {
    this.registry.set(name, loader);
  }

  async resolve(name: string): Promise<Type<unknown> | null> {
    return this.registry.get(name)?.() ?? null;
  }
}
```

Extensions registered at startup via `APP_INITIALIZER` with lazy `import()`:

```ts
registry.register('table-header', () =>
  import('./extensions/custom-header-widget.component')
    .then(m => m.CustomHeaderWidgetComponent)
);
```

Directive resolves and renders components into extension points:

```ts
@Directive({ selector: '[appExtensionPoint]' })
export class ExtensionPointDirective implements OnInit {
  @Input({ required: true }) appExtensionPoint!: string;

  async ngOnInit() {
    const comp = await this.registry.resolve(this.appExtensionPoint);
    if (comp) this.vcr.createComponent(comp);
  }
}
```

Use declaratively in templates:

```html
<ng-container appExtensionPoint="table-header"></ng-container>
<table>...</table>
<ng-container appExtensionPoint="table-toolbar"></ng-container>
```

## Customized Components

| Extension Point | What's rendered | Loaded component |
|---|---|---|
| `table-header` (above table) | Order summary dashboard | `CustomHeaderWidgetComponent` |
| `status-cell` (per table row) | Colored status pill/badge | `CustomStatusCellComponent` |
| `table-toolbar` (below table) | Export CSV + Print buttons | `CustomToolbarComponent` |

The `DataTableComponent` defines three named slots. It doesn't import the extension components directly -- they're resolved at runtime from the registry and code-split into separate lazy chunks.

## How to Interact

1. **Observe the header widget** above the table -- "5 orders, 2 pending, 3 completed" summary, loaded dynamically into the `table-header` extension point
2. **Look at the Status column** -- colored pills (green/yellow/red) instead of plain text, loaded via `ViewChildren` into per-row `status-cell` extension points
3. **Click "Export CSV"** or **"Print"** in the toolbar below the table -- triggers alerts (loaded into `table-toolbar` extension point)
4. **Check the build output** (`npx ng build`) -- three lazy chunks appear: `custom-header-widget`, `custom-status-cell`, `custom-toolbar`

## Run

```bash
npx ng serve
```
