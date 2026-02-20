# Angular Plugin Customization Demos

Five demo apps, each showing a different technique for enabling customer customization in Angular.

## Approaches

### 1. [DI Plugin Registry](./approach-1-di-plugin)

`InjectionToken` + `multi: true`. Customers implement typed interfaces, register via DI providers. Host collects all plugins automatically. Type-safe, AOT-compatible, zero extra deps.

**Trade-off:** Build-time only -- plugins must be bundled with the app.

### 2. [Module Federation](./approach-2-module-federation)

Host loads customer components from separately deployed Angular apps at runtime via `@angular-architects/native-federation`. No host rebuild needed. *(Demo simulates the pattern locally.)*

**Trade-off:** Complex infrastructure, version compatibility between host and remotes.

### 3. [Web Components](./approach-3-web-components)

Customers write vanilla `HTMLElement` subclasses (or any framework). Host loads them into extension slots. Data via HTML attributes, events via `CustomEvent`.

**Trade-off:** No type safety across boundaries, limited Angular service access.

### 4. [Config-Driven UI](./approach-4-config-driven)

All customization via JSON config (theme, columns, feature flags). No customer code needed. Config loadable from API/DB, hot-swappable at runtime.

**Trade-off:** Limited to predefined options -- can't add new behavior.

### 5. [Dynamic Component Loading](./approach-5-dynamic-components)

Named extension points in templates via `ViewContainerRef`. Registry maps names to lazy-loaded components. Code-split into separate chunks.

**Trade-off:** Customer components must be pre-built into the app (unless combined with Module Federation).

## Comparison

| | DI Plugin | Module Fed | Web Components | Config-Driven | Dynamic Components |
|---|---|---|---|---|---|
| Runtime loading | No | Yes | Yes | Yes (config) | Partial |
| Customer needs Angular | Yes | Yes | No | No | N/A |
| Type safety | Yes | Partial | No | N/A | Yes |
| Setup complexity | Low | High | Medium | Low | Medium |
| Customization depth | High | Very High | High | Low-Medium | Medium-High |

## Run any demo

```bash
cd approach-N-*
npx ng serve
# http://localhost:4200
```

## Next Steps
- Summarize which parts need to be extensible
  - search filter, row context menu, custom table column, context menu for all selected rows, sidebar inject custom component  
- Create POC Web Components & Module Federation Client
- (Create POC Web Components & Module Federation Archetype)



