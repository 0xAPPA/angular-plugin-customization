# Approach 2: Module Federation (Simulated)

Customization via runtime-loaded remote Angular apps. The host discovers and loads customer components from separately deployed bundles using a federation manifest. No host rebuild needed when adding plugins.

This demo **simulates** the pattern locally since real Module Federation requires multi-project webpack/esbuild setup.

## Technique

Host defines a manifest of remote modules:

```ts
interface RemoteModuleConfig {
  remoteName: string;
  exposedModule: string;
  remoteEntry?: string;
}
```

A loader service resolves remote components (simulated here, real version uses `loadRemoteModule()`):

```ts
@Injectable({ providedIn: 'root' })
export class RemoteComponentLoader {
  async loadComponent(config: RemoteModuleConfig): Promise<Type<any>> {
    // In production: return loadRemoteModule(config).then(m => m[config.exposedModule]);
    return this.localRegistry.get(key)!;
  }
}
```

Host inserts remote components via `ViewContainerRef.createComponent()`.

### Real federation config

```js
// Host federation.config.js
module.exports = withNativeFederation({
  name: 'host-app',
  shared: { '@angular/core': { singleton: true, strictVersion: true } },
});

// Remote federation.config.js
module.exports = withNativeFederation({
  name: 'customer-app',
  exposes: { './TableWidget': './src/app/table-widget.component.ts' },
});
```

```ts
// Host loads remote at runtime via router
const routes: Routes = [{
  path: 'customer-table',
  loadComponent: () =>
    loadRemoteModule({ remoteName: 'customer-app', exposedModule: './TableWidget' })
      .then(m => m.TableWidgetComponent),
}];
```

## Customized Components

| Component | What's customized | Remote source |
|---|---|---|
| `HostDashboardComponent` | Widget area below toolbar | Dynamically loaded remotes |
| `RemoteTableWidgetComponent` | Customer orders table | `customer-app/TableWidget` |
| `RemoteChartWidgetComponent` | Revenue bar chart | `analytics-app/ChartWidget` |

The host dashboard defines a widget area (`ViewContainerRef`). Remote components are inserted/removed at runtime based on a federation manifest.

## How to Interact

1. **Click "Load Table Widget"** -- simulated 600ms network delay, then a customer orders table appears
2. **Click "Load Chart Widget"** -- a horizontal bar chart widget appears below the table
3. **Click "Unload Table Widget"** (green button) -- removes the table widget, chart stays
4. **Load both, then unload both** -- widget area returns to empty placeholder state

## Run

```bash
npx ng serve
```
