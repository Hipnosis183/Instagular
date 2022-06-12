import { Directive, ElementRef, Input } from '@angular/core';
import tippy, { createSingleton } from 'tippy.js';

@Directive({ selector: '[tooltipArray]' })

export class TooltipArrayDirective {

  constructor(private elementRef: ElementRef) { }

  @Input() tooltipArrayOffset?: any = [0, 10];
  @Input() tooltipArrayPlace?: any = 'top';
  @Input() tooltipArrayTheme?: string = 'tooltip';

  ngAfterViewInit(): void {
    let tippyInstances: any[] = [];
    for (let child of this.elementRef.nativeElement.children) {
      if (!child.getAttribute('tooltipIgnore')) {
        tippyInstances.push(tippy(child, {
          animation: 'fade',
          content: child.getAttribute('tooltipItem'),
          offset: this.tooltipArrayOffset,
        }));
      }
    }
    createSingleton(tippyInstances, {
      delay: [800, 200],
      duration: [200, 200],
      moveTransition: 'transform 0.2s ease-out',
      placement: this.tooltipArrayPlace,
      theme: this.tooltipArrayTheme,
    });
  }
}
