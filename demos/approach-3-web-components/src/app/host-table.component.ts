import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { ExtensionSlotComponent } from './extension-slot.component';

interface Customer {
  id: number;
  name: string;
  status: 'active' | 'inactive' | 'pending';
}

@Component({
  selector: 'app-host-table',
  standalone: true,
  imports: [ExtensionSlotComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="layout">
      <!-- ── Table ──────────────────────────────────────── -->
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Status (Web Component)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          @for (c of customers; track c.id) {
            <tr [class.selected]="selected?.id === c.id">
              <td>{{ c.id }}</td>
              <td>{{ c.name }}</td>
              <td>
                <!-- Direct usage of custom element in Angular template -->
                <customer-status-badge
                  [attr.status]="c.status"
                  (status-click)="onStatusClick($event)"
                ></customer-status-badge>
              </td>
              <td>
                <button class="select-btn" (click)="selectCustomer(c)">Details</button>
              </td>
            </tr>
          }
        </tbody>
      </table>

      <!-- ── Side panel (loaded via ExtensionSlot) ────── -->
      <aside class="side-panel">
        <h3>Detail Panel (Extension Slot)</h3>
        <app-extension-slot
          #detailSlot
          slotName="customer-detail"
          (pluginEvent)="onPluginEvent($event)"
        ></app-extension-slot>
        @if (!selected) {
          <p class="hint">Select a row to load plugin panel.</p>
        }
      </aside>
    </div>

    <!-- ── Event log ────────────────────────────────────── -->
    <section class="event-log">
      <h3>Event Log</h3>
      <ul #logList>
        @for (entry of eventLog; track $index) {
          <li>{{ entry }}</li>
        }
      </ul>
    </section>
  `,
  styles: [`
    .layout { display: flex; gap: 24px; }
    table { border-collapse: collapse; flex: 1; }
    th, td { text-align: left; padding: 8px 12px; border-bottom: 1px solid #e5e7eb; }
    th { background: #f3f4f6; font-size: 13px; text-transform: uppercase; letter-spacing: .5px; }
    tr.selected { background: #eff6ff; }
    .select-btn {
      padding: 4px 12px; border: 1px solid #d1d5db; border-radius: 6px;
      background: #fff; cursor: pointer; font-size: 13px;
    }
    .select-btn:hover { background: #f3f4f6; }
    .side-panel {
      width: 280px; padding: 16px; border: 1px solid #e5e7eb;
      border-radius: 8px; background: #fff; align-self: flex-start;
    }
    .side-panel h3 { margin: 0 0 12px 0; font-size: 14px; color: #374151; }
    .hint { color: #9ca3af; font-size: 13px; }
    .event-log {
      margin-top: 24px; padding: 16px; border: 1px solid #e5e7eb;
      border-radius: 8px; background: #fefce8;
    }
    .event-log h3 { margin: 0 0 8px 0; font-size: 14px; }
    .event-log ul { margin: 0; padding-left: 20px; font-size: 13px; font-family: monospace; }
  `],
})
export class HostTableComponent implements AfterViewInit {
  @ViewChild('detailSlot') detailSlot!: ExtensionSlotComponent;
  @ViewChild('logList') logList!: ElementRef;

  customers: Customer[] = [
    { id: 1, name: 'Alice Johnson', status: 'active' },
    { id: 2, name: 'Bob Smith', status: 'inactive' },
    { id: 3, name: 'Carol Williams', status: 'pending' },
    { id: 4, name: 'Dave Brown', status: 'active' },
  ];

  selected: Customer | null = null;
  eventLog: string[] = [];

  ngAfterViewInit(): void {
    // slot is ready
  }

  selectCustomer(c: Customer): void {
    this.selected = c;
    this.log(`Row selected: ${c.name}`);

    // Load customer-info-panel into the extension slot
    this.detailSlot.loadWebComponent(
      'customer-info-panel',
      { 'customer-name': c.name, 'customer-status': c.status },
      ['contact-request'],
    );
  }

  /** Handle CustomEvents coming from status badge (inline in template). */
  onStatusClick(event: Event): void {
    const detail = (event as CustomEvent).detail;
    this.log(`status-click -> status="${detail?.status}"`);
  }

  /** Handle CustomEvents coming from the extension slot. */
  onPluginEvent(event: CustomEvent): void {
    this.log(`${event.type} -> detail=${JSON.stringify(event.detail)}`);
  }

  private log(msg: string): void {
    const ts = new Date().toLocaleTimeString();
    this.eventLog = [...this.eventLog, `[${ts}] ${msg}`];
  }
}
