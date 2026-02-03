# Approach 3: Web Components

Customization via framework-agnostic Custom Elements. Plugins are vanilla JS `HTMLElement` subclasses -- no Angular dependency. Host communicates via HTML attributes (host -> plugin) and `CustomEvent` (plugin -> host).

## Technique

Customer defines plain Web Components:

```ts
customElements.define('customer-status-badge', class extends HTMLElement {
  static observedAttributes = ['status'];

  connectedCallback() {
    // render based on this.getAttribute('status')
    this.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('status-click', {
        bubbles: true, composed: true,
        detail: { status: this.getAttribute('status') },
      }));
    });
  }
});
```

Host uses them directly in Angular templates with `CUSTOM_ELEMENTS_SCHEMA`:

```html
<customer-status-badge
  [attr.status]="row.status"
  (status-click)="onStatusClick($event)"
></customer-status-badge>
```

Or loads them programmatically via an extension slot:

```ts
@Component({ selector: 'app-extension-slot', template: `<div #container></div>` })
export class ExtensionSlotComponent {
  loadWebComponent(tagName: string, attributes?: Record<string, string>) {
    const el = document.createElement(tagName);
    for (const [k, v] of Object.entries(attributes ?? {})) el.setAttribute(k, v);
    this.container.nativeElement.appendChild(el);
  }
}
```

Register custom elements before Angular bootstrap in `main.ts`:

```ts
registerCustomElements();
bootstrapApplication(AppComponent, appConfig);
```

## Customized Components

| Component | What's customized | Web Component used |
|---|---|---|
| `HostTableComponent` status column | Cell renderer replaced with custom element | `<customer-status-badge>` |
| `HostTableComponent` side panel | Detail panel loaded into extension slot | `<customer-info-panel>` |

Both custom elements are vanilla JS (`HTMLElement` subclasses) -- zero framework dependency. They could be built with React, Vue, or any other tool.

## How to Interact

1. **Click a colored status badge** in the Status column -- fires a `status-click` CustomEvent, logged in the event log
2. **Click "Details"** on any row -- loads `<customer-info-panel>` into the side panel extension slot
3. **Click "Contact"** button in the side panel -- fires a `contact-request` CustomEvent with the customer name
4. **Watch the Event Log** at the bottom -- all CustomEvent traffic between host and plugins is logged with timestamps

## Run

```bash
npx ng serve
```
