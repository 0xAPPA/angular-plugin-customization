/**
 * Registers vanilla JS Web Components (custom elements).
 * These are framework-agnostic -- plain HTMLElement subclasses.
 */
export function registerCustomElements(): void {

  // ── customer-status-badge ─────────────────────────────────────────
  // Displays a colored badge based on `status` attribute.
  // Dispatches `status-click` CustomEvent on click.
  customElements.define('customer-status-badge', class extends HTMLElement {
    static observedAttributes = ['status'];

    private badge!: HTMLSpanElement;

    connectedCallback(): void {
      this.badge = document.createElement('span');
      this.updateBadge();
      this.appendChild(this.badge);

      this.badge.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('status-click', {
          bubbles: true,
          composed: true, // crosses shadow DOM boundaries
          detail: { status: this.getAttribute('status') },
        }));
      });
    }

    attributeChangedCallback(): void {
      if (this.badge) this.updateBadge();
    }

    private updateBadge(): void {
      const status = this.getAttribute('status') ?? 'unknown';
      const colors: Record<string, string> = {
        active: '#16a34a',
        inactive: '#dc2626',
        pending: '#ca8a04',
      };
      const bg = colors[status] ?? '#6b7280';

      Object.assign(this.badge.style, {
        display: 'inline-block',
        padding: '2px 10px',
        borderRadius: '12px',
        color: '#fff',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer',
        backgroundColor: bg,
      });
      this.badge.textContent = status;
    }
  });

  // ── customer-info-panel ───────────────────────────────────────────
  // Shows customer name (from `customer-name` attr) + "Contact" button.
  // Dispatches `contact-request` CustomEvent on button click.
  customElements.define('customer-info-panel', class extends HTMLElement {
    static observedAttributes = ['customer-name', 'customer-status'];

    private panel!: HTMLDivElement;

    connectedCallback(): void {
      this.panel = document.createElement('div');
      this.renderPanel();
      this.appendChild(this.panel);
    }

    attributeChangedCallback(): void {
      if (this.panel) this.renderPanel();
    }

    private renderPanel(): void {
      const name = this.getAttribute('customer-name') ?? 'N/A';
      const status = this.getAttribute('customer-status') ?? '';

      this.panel.innerHTML = `
        <div style="padding:16px;border:1px solid #e5e7eb;border-radius:8px;background:#f9fafb;">
          <h3 style="margin:0 0 8px 0;font-size:16px;">${name}</h3>
          <p style="margin:0 0 12px 0;color:#6b7280;font-size:14px;">Status: ${status}</p>
          <button id="contact-btn"
            style="padding:6px 16px;border:none;border-radius:6px;background:#2563eb;color:#fff;cursor:pointer;font-size:14px;">
            Contact
          </button>
        </div>
      `;

      this.panel.querySelector('#contact-btn')!.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('contact-request', {
          bubbles: true,
          composed: true,
          detail: { customerName: name },
        }));
      });
    }
  });
}
