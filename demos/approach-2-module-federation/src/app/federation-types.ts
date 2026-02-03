import { Injectable, Type } from '@angular/core';

/** Config describing a remote module to load via Module Federation. */
export interface RemoteModuleConfig {
  remoteName: string;
  exposedModule: string;
  remoteEntry?: string;
}

/**
 * Simulates the runtime loading of remote components that Module Federation
 * would perform. In production, this would call `loadRemoteModule()` from
 * `@angular-architects/native-federation` (or the webpack-based variant).
 *
 * Here we keep a local registry and add a fake delay to mimic network latency.
 */
@Injectable({ providedIn: 'root' })
export class RemoteComponentLoader {
  private registry = new Map<string, () => Promise<Type<unknown>>>();

  /** Register a component factory under `remoteName/exposedModule`. */
  register(remoteName: string, exposedModule: string, factory: () => Promise<Type<unknown>>): void {
    this.registry.set(`${remoteName}/${exposedModule}`, factory);
  }

  /**
   * Load a "remote" component by config.
   * Simulates network latency with a short delay.
   */
  async loadComponent(config: RemoteModuleConfig): Promise<Type<unknown>> {
    const key = `${config.remoteName}/${config.exposedModule}`;
    const factory = this.registry.get(key);

    if (!factory) {
      throw new Error(`Remote module not found: ${key}`);
    }

    // Simulate network fetch of remoteEntry.js
    await new Promise(resolve => setTimeout(resolve, 600));

    return factory();
  }
}
