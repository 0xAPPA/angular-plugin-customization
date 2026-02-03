import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { ConfigService } from './config.service';
import { DEFAULT_CUSTOMER_CONFIG, MINIMAL_CUSTOMER_CONFIG } from './sample-configs';

@Component({
  selector: 'app-config-switcher',
  standalone: true,
  imports: [JsonPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="switcher">
      <h3>Switch Customer Config</h3>
      <div class="btn-row">
        <button [class.active]="activePreset() === 'default'"
                (click)="loadDefault()">
          Default Customer
        </button>
        <button [class.active]="activePreset() === 'minimal'"
                (click)="loadMinimal()">
          Minimal Customer
        </button>
      </div>

      <details>
        <summary>Current Config JSON</summary>
        <pre>{{ configService.config() | json }}</pre>
      </details>
    </div>
  `,
  styles: [`
    .switcher {
      margin-bottom: 24px;
      padding: 16px;
      background: #f5f5f5;
      border-radius: 8px;
    }
    h3 { margin: 0 0 12px; }
    .btn-row {
      display: flex;
      gap: 8px;
      margin-bottom: 12px;
    }
    button {
      padding: 8px 20px;
      border: 2px solid #999;
      border-radius: 4px;
      background: white;
      cursor: pointer;
      font-weight: 600;
      font-size: 14px;
    }
    button.active {
      border-color: #1565c0;
      background: #1565c0;
      color: white;
    }
    details {
      margin-top: 8px;
    }
    summary {
      cursor: pointer;
      font-size: 13px;
      color: #666;
    }
    pre {
      background: #263238;
      color: #c3e88d;
      padding: 12px;
      border-radius: 4px;
      font-size: 12px;
      overflow-x: auto;
      max-height: 300px;
    }
  `],
})
export class ConfigSwitcherComponent {
  readonly configService = inject(ConfigService);

  activePreset = () => {
    const primary = this.configService.config().theme.primaryColor;
    return primary === DEFAULT_CUSTOMER_CONFIG.theme.primaryColor ? 'default' : 'minimal';
  };

  loadDefault(): void {
    this.configService.loadConfig(DEFAULT_CUSTOMER_CONFIG);
  }

  loadMinimal(): void {
    this.configService.loadConfig(MINIMAL_CUSTOMER_CONFIG);
  }
}
