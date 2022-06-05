import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';
import tippy from 'tippy.js';

@Directive({
  selector: '[tooltip]'
})

export class TooltipDirective implements AfterViewInit {

  constructor(private elementRef: ElementRef) { }

  @Input() offset?: any;
  @Input() theme?: string;
  @Input() tooltip!: string;

  ngAfterViewInit(): void {
    tippy(this.elementRef.nativeElement, {
      animation: 'fade',
      content: this.tooltip,
      delay: [800, 200],
      duration: [200, 200],
      offset: this.offset ? this.offset : [0, 10],
      theme: this.theme ? this.theme : 'tooltip',
    });
  }
}
