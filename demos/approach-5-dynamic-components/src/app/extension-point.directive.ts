import {
  Directive,
  Input,
  ViewContainerRef,
  OnInit,
  inject,
  ComponentRef,
} from '@angular/core';
import { ExtensionRegistryService } from './extension-registry.service';

@Directive({
  selector: '[appExtensionPoint]',
  standalone: true,
})
export class ExtensionPointDirective implements OnInit {
  @Input({ required: true }) appExtensionPoint!: string;
  @Input() extensionData: unknown;

  private vcr = inject(ViewContainerRef);
  private registry = inject(ExtensionRegistryService);

  async ngOnInit(): Promise<void> {
    this.vcr.clear();

    const componentType = await this.registry.resolve(this.appExtensionPoint);

    if (componentType) {
      const ref: ComponentRef<unknown> = this.vcr.createComponent(componentType);

      // Pass data to the component if it has a `data` input
      if (this.extensionData !== undefined && 'data' in (ref.instance as object)) {
        (ref.instance as Record<string, unknown>)['data'] = this.extensionData;
        ref.changeDetectorRef.detectChanges();
      }
    }
  }
}
