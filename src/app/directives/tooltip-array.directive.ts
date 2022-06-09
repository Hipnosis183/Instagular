import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';
import tippy, { createSingleton } from 'tippy.js';

@Directive({ selector: '[tooltipArray]' })

export class TooltipArrayDirective implements AfterViewInit {

  constructor(private elementRef: ElementRef) { }

  @Input() offset?: any = [0, 10];
  @Input() place?: any = 'top';
  @Input() theme?: string = 'tooltip';

  ngAfterViewInit(): void {
    let tippyInstances: any[] = [];
    for (let child of this.elementRef.nativeElement.children) {
      tippyInstances.push(tippy(child, {
        animation: 'fade',
        content: child.getAttribute('tooltipItem'),
        offset: this.offset,
      }));
    }
    createSingleton(tippyInstances, {
      delay: [800, 200],
      duration: [200, 200],
      moveTransition: 'transform 0.2s ease-out',
      placement: this.place,
      theme: this.theme,
    });
  }
}
