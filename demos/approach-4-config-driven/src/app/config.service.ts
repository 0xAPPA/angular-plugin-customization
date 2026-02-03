import { Injectable, signal, computed } from '@angular/core';
import { AppConfig } from './config.model';
import { DEFAULT_CUSTOMER_CONFIG } from './sample-configs';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private readonly configSignal = signal<AppConfig>(DEFAULT_CUSTOMER_CONFIG);

  readonly config = this.configSignal.asReadonly();
  readonly visibleColumns = computed(() =>
    this.configSignal().table.columns.filter(c => c.visible)
  );

  /** Simulate loading config from API/DB */
  loadConfig(config: AppConfig): void {
    this.configSignal.set(config);
  }

  /** Merge partial overrides into current config */
  updateConfig(partial: Partial<AppConfig>): void {
    this.configSignal.update(current => ({
      ...current,
      ...partial,
      theme: { ...current.theme, ...partial.theme },
      table: { ...current.table, ...partial.table },
      features: { ...current.features, ...partial.features },
    }));
  }
}
