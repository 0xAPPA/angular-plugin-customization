Read this plan and implement a minimal demo angular app for each plugin mechanism that shows how it works.

# Angular Plugin / Customization Mechanisms

## Context
- Angular 17-18
- Currently modifying code internally per customer. No customer code access yet.
- Customers write Angular. Focus: table customization (context menus, filters, column icons).
- Tables only for now, expand later.
- Deployment model undecided.

---

## Approach 1: DI-Based Plugin Registry (InjectionToken + `multi: true`)

**How:** Define extension points as `InjectionToken<T[]>` with `multi: true`. Customers provide their implementations. A `PluginRegistry` service collects and orchestrates them.

```typescript
export const APP_PLUGINS = new InjectionToken<AppPlugin[]>('app.plugins');

// Customer registers their plugin
bootstrapApplication(AppComponent, {
  providers: [
    { provide: APP_PLUGINS, useClass: CustomerPlugin, multi: true },
  ]
});
```

**Pros:**
- Native Angular, no extra deps
- Type-safe, AOT-compatible
- Works with standalone components
- Fine-grained: define tokens per extension point (header, sidebar, dashboard widgets, etc.)

**Cons:**
- Customer must have access to the bootstrap code (or a config layer that feeds into it)
- Plugins are bundled at build-time (not runtime-loaded)
- Requires Angular knowledge from customer

**Best for:** Internal teams or technically skilled customers who build & deploy themselves.

**Sources:** [Plugin-Based Architecture Angular 19+](https://dev.to/atheodosiou/how-i-built-a-plugin-based-architecture-in-angular-19-1n6o), [This Dot Labs - Plugin Architecture](https://www.thisdot.co/blog/plugin-architecture-for-angular-libraries-using-dependency-injection), [InjectionToken Angular Docs](https://angular.dev/api/core/InjectionToken)

---

## Approach 2: Module Federation / Native Federation (Runtime Plugin Loading)

**How:** Host app loads customer-specific remote modules at runtime. Customer deploys their own Angular micro-frontend. Host discovers remotes via a manifest/config (Dynamic Module Federation).

**Pros:**
- True runtime loading - no rebuild of host needed
- Customer deploys independently
- Shared deps (Angular core, etc.) loaded once
- Native Federation is build-tool agnostic (works with esbuild)

**Cons:**
- Complex setup and infrastructure
- Version compatibility between host and remotes must be managed
- Debugging across boundaries is harder
- Overhead for small customizations

**Best for:** Large-scale SaaS with technically capable customers who deploy their own frontends.

**Sources:** [@angular-architects/module-federation](https://www.npmjs.com/package/@angular-architects/module-federation), [Nx Dynamic Module Federation](https://nx.dev/recipes/angular/dynamic-module-federation-with-angular), [Native Federation Angular 19](https://medium.com/@luca.cossaro_28192/micro-frontends-with-angular-19-and-module-federation-83ba7a7b6a13), [Angular Architects Blog](https://www.angulararchitects.io/en/blog/the-microfrontend-revolution-part-2-module-federation-with-angular/)

---

## Approach 3: Web Components / Angular Elements (Framework-Agnostic Plugins)

**How:** Define extension slots in host app (`<slot name="customer-header">`). Customer builds Web Components (in any framework or vanilla JS) and host loads them dynamically from external URLs.

**Pros:**
- Framework-agnostic - customer can use React, Vue, vanilla JS
- Shadow DOM encapsulation prevents style conflicts
- Can be loaded dynamically at runtime from CDN/external server
- Lowest coupling between host and plugin

**Cons:**
- Limited communication between host and plugin (attributes, events, CustomEvents)
- Sharing Angular services/state with plugins is non-trivial
- Bundle size if customer uses Angular Elements (includes Angular runtime)
- No type safety across boundaries

**Best for:** Platform where customers have diverse tech stacks and need maximum freedom.

**Sources:** [Angular Elements Docs](https://angular.dev/guide/elements), [Angular Elements with Standalone Components](https://www.angulararchitects.io/en/blog/angular-elements-web-components-with-standalone-components/), [Academind - Adding Web Components](https://academind.com/tutorials/adding-web-components-to-any-app)

---

## Approach 4: Configuration-Driven UI (JSON/DB Config)

**How:** Define all customizable aspects as configuration. Customer provides a JSON config (or via admin UI) that controls: which components to show, field visibility, validation rules, theming, feature toggles, menu items, etc.

```json
{
  "theme": { "primaryColor": "#1a73e8", "logo": "url" },
  "features": { "showDashboard": true, "enableExport": false },
  "layout": { "sidebar": ["nav", "customer-widget"], "header": "compact" },
  "forms": { "contact": { "fields": ["name", "email"], "required": ["name"] } }
}
```

**Pros:**
- No code required from customer
- Easy to implement admin UI for configuration
- Safe - customer can't break the app
- Hot-reloadable without deployment

**Cons:**
- Limited to predefined customization options
- Can't add truly new behavior/components
- Config schema grows complex over time
- Every new customization option requires dev work on your side

**Best for:** Non-technical customers who need theming, feature toggling, and layout adjustments.

---

## Approach 5: Dynamic Component Loading with Extension Points

**How:** Define named extension points in the app using `ViewContainerRef`. At runtime, resolve which component to load per customer (from a registry or config). Lazy-load customer-specific components.

```typescript
// In template
<ng-container #extensionPoint></ng-container>

// In component
@ViewChild('extensionPoint', { read: ViewContainerRef }) container: ViewContainerRef;

async loadCustomerComponent() {
  const comp = await this.extensionRegistry.resolve('dashboard-widget', this.customerId);
  this.container.createComponent(comp);
}
```

**Pros:**
- Extension points are explicit and well-defined
- Lazy loading keeps initial bundle small
- Can combine with config-driven approach
- Works well with Angular's standalone components

**Cons:**
- Customer components must be pre-built and included in the build (unless combined with Module Federation)
- Requires careful API design for extension point contracts

**Best for:** Multi-tenant apps where your team builds customer-specific components but wants a clean architecture.

**Sources:** [Angular Dynamic Component Loader](https://github.com/angular/angular/blob/main/aio/content/guide/dynamic-component-loader.md), [Dynamic Component Loading Guide](https://www.c-sharpcorner.com/article/mastering-dynamic-component-loading-and-lazy-routes-in-angular-boosting-perform/)

---

## Approach 6: Hybrid (Recommended for Most Cases)

Combine approaches based on customization depth:

| Customization Level | Mechanism |
|---|---|
| **Theming** (colors, logos, fonts) | CSS Custom Properties + config |
| **Feature toggles** (show/hide features) | Config-driven (JSON/DB) |
| **Layout variations** (reorder, swap sections) | Config + Dynamic Component Loading |
| **Custom components** (new widgets, pages) | DI Plugin Registry or Module Federation |
| **Deep behavior changes** (custom workflows) | Module Federation or Web Components |

### Architecture Sketch
```
                    +-----------------------+
                    |   Customer Config DB  |
                    +-----------+-----------+
                                |
                    +-----------v-----------+
                    |    Config Service     |
                    +-----------+-----------+
                                |
          +---------------------+---------------------+
          |                     |                     |
+---------v--------+  +---------v--------+  +---------v--------+
| Theme Engine     |  | Feature Flags    |  | Extension Points |
| (CSS vars)       |  | (show/hide)      |  | (ViewContainerRef|
|                  |  |                  |  |  + DI Registry)  |
+------------------+  +------------------+  +--------+---------+
                                                     |
                                            +--------v---------+
                                            | Plugin Loader    |
                                            | (Module Fed /    |
                                            |  Dynamic Import) |
                                            +------------------+
```

---

## Comparison Matrix

| Criteria | DI Plugin | Module Fed | Web Components | Config-Driven | Dynamic Components |
|---|---|---|---|---|---|
| Runtime loading | No | Yes | Yes | Yes (config) | Partial |
| Customer needs Angular skills | Yes | Yes | No | No | N/A (your team) |
| Type safety | Yes | Partial | No | N/A | Yes |
| Isolation | Low | Medium | High (Shadow DOM) | N/A | Low |
| Setup complexity | Low | High | Medium | Low | Medium |
| Customization depth | High | Very High | High | Low-Medium | Medium-High |
| Independent deployment | No | Yes | Yes | N/A | No |

---

---

## Recommendation

### DI Plugin Registry + Dynamic Component Loading (Approach 1 + 5)

Why this fits:
- Customers know Angular -> can implement typed plugin interfaces
- Extension points map directly to use cases (table row menu, column renderer, filter provider)
- No infra overhead (unlike Module Federation)
- Works with Angular 17-18 standalone components
- Can add Module Federation later if independent deployment becomes a requirement
- Narrow scope (tables only) makes this a clean first step

### Concrete Example: Table Extension Points

```typescript
// === CONTRACTS (shared library) ===

// Context menu extension
export interface TableContextMenuItem {
  label: string;
  icon?: string;
  action: (row: any) => void;
  visible?: (row: any) => boolean;
}

export const TABLE_CONTEXT_MENU = new InjectionToken<TableContextMenuProvider[]>('table.contextMenu');

export interface TableContextMenuProvider {
  getItems(tableId: string, row: any): TableContextMenuItem[];
}

// Column renderer extension
export const COLUMN_RENDERER = new InjectionToken<ColumnRendererProvider[]>('table.columnRenderer');

export interface ColumnRendererProvider {
  columnId: string;
  component: Type<any>;  // Angular component to render in the cell
}

// Filter extension
export const TABLE_FILTER = new InjectionToken<TableFilterProvider[]>('table.filter');

export interface TableFilterProvider {
  filterId: string;
  label: string;
  component: Type<any>;  // Filter UI component
  apply: (data: any[], filterValue: any) => any[];
}
```

```typescript
// === CUSTOMER PLUGIN ===
@Injectable()
export class AcmeContextMenu implements TableContextMenuProvider {
  getItems(tableId: string, row: any): TableContextMenuItem[] {
    if (tableId !== 'orders') return [];
    return [
      { label: 'Export to SAP', icon: 'upload', action: (r) => this.sapService.export(r) },
      { label: 'Flag for review', icon: 'flag', action: (r) => this.flagService.flag(r) },
    ];
  }
}

// Customer registers in their bootstrap or feature module
providers: [
  { provide: TABLE_CONTEXT_MENU, useClass: AcmeContextMenu, multi: true },
  { provide: COLUMN_RENDERER, useValue: { columnId: 'status', component: AcmeStatusBadge }, multi: true },
  { provide: TABLE_FILTER, useClass: AcmeRegionFilter, multi: true },
]
```

```typescript
// === HOST TABLE COMPONENT (your code) ===
@Component({ ... })
export class DataTableComponent {
  private contextMenuProviders = inject(TABLE_CONTEXT_MENU, { optional: true }) ?? [];
  private columnRenderers = inject(COLUMN_RENDERER, { optional: true }) ?? [];
  private filterProviders = inject(TABLE_FILTER, { optional: true }) ?? [];

  getContextMenuItems(row: any): TableContextMenuItem[] {
    return this.contextMenuProviders.flatMap(p => p.getItems(this.tableId, row));
  }

  getColumnRenderer(columnId: string): Type<any> | null {
    return this.columnRenderers.find(r => r.columnId === columnId)?.component ?? null;
  }
}
```

### How Customer Gets Access (Decision Needed)

Since customers have no code access yet, you need to decide how they consume the base app:

**Option A: Publish base app as npm package (Recommended)**
- You publish `@yourorg/app-core` with the extension point contracts
- Customer creates their own Angular project, imports your package
- Customer registers their plugins in their own `bootstrapApplication`
- Customer builds and deploys their customized app
- You version the contracts with semver

**Option B: Template repo / scaffold CLI**
- Customer clones a template repo with the base app included
- Predefined slots for plugin registration
- You provide a CLI or schematic: `ng generate customer-plugin --type=context-menu`

**Option C: Monorepo with customer libraries**
- You add customer as a library in your Nx monorepo
- Tighter coupling but easier to coordinate during early phases
- Can evolve to Option A later

### Migration Path
```
Phase 1: Define extension point contracts (InjectionTokens + interfaces) as a shared library
Phase 2: Refactor existing tables to consume from DI registry
Phase 3: Move existing customer-specific code into plugin implementations
Phase 4: Publish base app + contracts as npm packages (or choose delivery model)
Phase 5: (Optional) Add Module Federation for runtime loading if needed
```

### Angular 17-18 Notes
- Use `APP_INITIALIZER` token (not `provideAppInitializer`, which is Angular 19+)
- Standalone components fully supported
- `inject()` function works in constructors and field initializers

---
