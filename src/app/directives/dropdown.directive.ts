import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';
import tippy from 'tippy.js';

@Directive({
  selector: '[dropdown]'
})

export class DropdownDirective implements AfterViewInit {

  constructor(private elementRef: ElementRef) { }

  @Input() dropdown!: HTMLElement;
  @Input() hover: boolean = false;

  ngAfterViewInit(): void {
    tippy(this.elementRef.nativeElement, {
      animation: 'fade',
      content: this.dropdown,
      delay: this.hover ? [800, 200] : 0,
      duration: [200, 200],
      interactive: true,
      theme: 'dropdown',
      trigger: this.hover ? 'mouseenter focus' : 'click',
    });
  }
}
