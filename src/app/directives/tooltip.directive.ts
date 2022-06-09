import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';
import tippy from 'tippy.js';

@Directive({ selector: '[tooltip]' })

export class TooltipDirective implements AfterViewInit {

  constructor(private elementRef: ElementRef) { }

  @Input() offset?: any = [0, 10];
  @Input() place?: any = 'top';
  @Input() theme?: string = 'tooltip';
  @Input() tooltip!: string;

  ngAfterViewInit(): void {
    tippy(this.elementRef.nativeElement, {
      animation: 'fade',
      content: this.tooltip,
      delay: [800, 200],
      duration: [200, 200],
      offset: this.offset,
      placement: this.place,
      theme: this.theme,
    });
  }
}
