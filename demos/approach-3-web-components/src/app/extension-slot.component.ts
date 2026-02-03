import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

/**
 * Generic extension slot: a named container into which
 * arbitrary custom elements can be loaded at runtime.
 */
@Component({
  selector: 'app-extension-slot',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<div #container></div>`,
})
export class ExtensionSlotComponent {
  @Input() slotName = '';
  @Output() pluginEvent = new EventEmitter<CustomEvent>();

  @ViewChild('container', { static: true }) container!: ElementRef<HTMLDivElement>;

  /**
   * Creates a custom element, sets attributes, appends it to the slot,
   * and wires up a list of CustomEvent names to the `pluginEvent` output.
   */
  loadWebComponent(
    tagName: string,
    attributes?: Record<string, string>,
    listenEvents?: string[],
  ): HTMLElement {
    // Clear previous content
    this.container.nativeElement.innerHTML = '';

    const el = document.createElement(tagName);

    if (attributes) {
      for (const [key, value] of Object.entries(attributes)) {
        el.setAttribute(key, value);
      }
    }

    if (listenEvents) {
      for (const eventName of listenEvents) {
        el.addEventListener(eventName, (e) => {
          this.pluginEvent.emit(e as CustomEvent);
        });
      }
    }

    this.container.nativeElement.appendChild(el);
    return el;
  }

  /** Remove all children from the slot. */
  clear(): void {
    this.container.nativeElement.innerHTML = '';
  }
}
