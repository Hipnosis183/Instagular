import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';
import tippy from 'tippy.js';

@Directive({ selector: '[tooltip]' })

export class TooltipDirective implements AfterViewInit {

  constructor(private elementRef: ElementRef) { }

  @Input() tooltip!: string;
  @Input() tooltipOffset?: any = [0, 10];
  @Input() tooltipPlace?: any = 'top';
  @Input() tooltipTheme?: string = 'tooltip';

  ngAfterViewInit(): void {
    tippy(this.elementRef.nativeElement, {
      animation: 'fade',
      content: this.tooltip,
      delay: [800, 200],
      duration: [200, 200],
      offset: this.tooltipOffset,
      placement: this.tooltipPlace,
      theme: this.tooltipTheme,
    });
  }
}
