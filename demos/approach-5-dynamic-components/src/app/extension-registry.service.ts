import { Injectable, Type } from '@angular/core';

export type ComponentLoader = () => Promise<Type<unknown>>;

@Injectable({ providedIn: 'root' })
export class ExtensionRegistryService {
  private registry = new Map<string, ComponentLoader>();

  register(name: string, loader: ComponentLoader): void {
    this.registry.set(name, loader);
  }

  async resolve(name: string): Promise<Type<unknown> | null> {
    const loader = this.registry.get(name);
    if (!loader) return null;
    return loader();
  }

  has(name: string): boolean {
    return this.registry.has(name);
  }
}
