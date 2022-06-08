import { AfterViewInit, Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import tippy from 'tippy.js';

@Directive({ selector: '[dropdown]' })

export class DropdownDirective implements AfterViewInit {

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) { }

  @Input() dropdown!: HTMLElement;
  @Input() hover: boolean = false;
  @Input() offset: any = [0, 10];
  @Input() place: any = 'top';
  @Input() target: any = null;

  ngAfterViewInit(): void {
    // Create Tippy instance.
    tippy(this.elementRef.nativeElement, {
      animation: 'fade',
      content: this.dropdown,
      delay: this.hover ? [800, 200] : 0,
      duration: [200, 200],
      interactive: true,
      offset: this.offset,
      placement: this.place,
      theme: 'dropdown',
      trigger: this.hover ? 'mouseenter focus' : 'click',
      triggerTarget: this.target,
    });
    // Attach listener to close dropdowns upon clicking inside.
    if (!this.hover) {
      this.renderer.listen(this.elementRef.nativeElement._tippy.popper, 'click', () => {
        this.elementRef.nativeElement._tippy.hide();
      });
    }
  }
}
