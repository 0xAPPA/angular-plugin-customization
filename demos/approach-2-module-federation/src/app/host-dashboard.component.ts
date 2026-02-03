import {
  Component,
  ViewContainerRef,
  ViewChild,
  ComponentRef,
  OnInit,
  OnDestroy,
  inject,
} from '@angular/core';
import { RemoteComponentLoader, RemoteModuleConfig } from './federation-types';
import { RemoteTableWidgetComponent } from './remote-components/remote-table-widget.component';
import { RemoteChartWidgetComponent } from './remote-components/remote-chart-widget.component';

interface SlotState {
  config: RemoteModuleConfig;
  label: string;
  loading: boolean;
  loaded: boolean;
  ref: ComponentRef<unknown> | null;
}

@Component({
  selector: 'app-host-dashboard',
  standalone: true,
  template: `
    <div class="dashboard">
      <div class="toolbar">
        @for (slot of slots; track slot.config.exposedModule) {
          <button
            class="btn"
            [class.btn-loaded]="slot.loaded"
            [disabled]="slot.loading"
            (click)="toggle(slot)"
          >
            {{ slot.loading ? 'Loading...' : slot.loaded ? 'Unload' : 'Load' }}
            {{ slot.label }}
          </button>
        }
      </div>

      <div class="widget-area">
        @for (slot of slots; track slot.config.exposedModule) {
          @if (slot.loading) {
            <div class="placeholder">
              <div class="spinner"></div>
              Loading remote module <strong>{{ slot.config.remoteName }}/{{ slot.config.exposedModule }}</strong>...
            </div>
          }
        }
        <ng-container #widgetHost></ng-container>
        @if (!anyLoaded) {
          <p class="empty-hint">Click a button above to load a federated remote component.</p>
        }
      </div>
    </div>
  `,
  styles: [`
    .dashboard { display: flex; flex-direction: column; gap: 20px; }
    .toolbar { display: flex; gap: 10px; flex-wrap: wrap; }
    .btn {
      padding: 8px 18px;
      border: 1px solid #ccc;
      border-radius: 6px;
      background: #fff;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.15s;
    }
    .btn:hover:not(:disabled) { background: #f5f5f5; border-color: #999; }
    .btn:disabled { opacity: 0.6; cursor: wait; }
    .btn-loaded { background: #e8f5e9; border-color: #66bb6a; color: #2e7d32; }
    .widget-area {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .placeholder {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px;
      background: #fafafa;
      border: 1px dashed #ccc;
      border-radius: 8px;
      font-size: 14px;
      color: #666;
    }
    .spinner {
      width: 20px; height: 20px;
      border: 3px solid #ddd;
      border-top-color: #1565c0;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .empty-hint {
      color: #999;
      font-size: 14px;
      text-align: center;
      padding: 30px;
    }
  `]
})
export class HostDashboardComponent implements OnInit, OnDestroy {
  @ViewChild('widgetHost', { read: ViewContainerRef, static: true })
  widgetHost!: ViewContainerRef;

  private loader = inject(RemoteComponentLoader);

  /**
   * Federation manifest -- in production, this would come from a JSON file
   * or an API that maps remote names to their deployed URLs.
   */
  slots: SlotState[] = [
    {
      config: { remoteName: 'customer-app', exposedModule: 'TableWidget', remoteEntry: 'http://localhost:4201/remoteEntry.js' },
      label: 'Table Widget',
      loading: false,
      loaded: false,
      ref: null,
    },
    {
      config: { remoteName: 'analytics-app', exposedModule: 'ChartWidget', remoteEntry: 'http://localhost:4202/remoteEntry.js' },
      label: 'Chart Widget',
      loading: false,
      loaded: false,
      ref: null,
    },
  ];

  get anyLoaded(): boolean {
    return this.slots.some(s => s.loaded || s.loading);
  }

  ngOnInit(): void {
    // Register local components to simulate a remote registry.
    // In real Module Federation the loader would fetch remoteEntry.js instead.
    this.loader.register('customer-app', 'TableWidget', () =>
      Promise.resolve(RemoteTableWidgetComponent),
    );
    this.loader.register('analytics-app', 'ChartWidget', () =>
      Promise.resolve(RemoteChartWidgetComponent),
    );
  }

  async toggle(slot: SlotState): Promise<void> {
    if (slot.loaded) {
      this.unload(slot);
      return;
    }
    await this.load(slot);
  }

  private async load(slot: SlotState): Promise<void> {
    slot.loading = true;
    try {
      const componentType = await this.loader.loadComponent(slot.config);
      slot.ref = this.widgetHost.createComponent(componentType);
      slot.loaded = true;
    } catch (err) {
      console.error('Failed to load remote module', err);
    } finally {
      slot.loading = false;
    }
  }

  private unload(slot: SlotState): void {
    if (slot.ref) {
      const idx = this.widgetHost.indexOf(slot.ref.hostView);
      if (idx !== -1) {
        this.widgetHost.remove(idx);
      }
      slot.ref = null;
    }
    slot.loaded = false;
  }

  ngOnDestroy(): void {
    this.widgetHost.clear();
  }
}
