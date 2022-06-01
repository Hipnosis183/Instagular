import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';
import tippy from 'tippy.js';

@Directive({
  selector: '[dropdown]'
})
export class DropdownDirective implements AfterViewInit {

  constructor(private elementRef: ElementRef) { }

  @Input() dropdown!: HTMLElement;

  ngAfterViewInit(): void {
    tippy(this.elementRef.nativeElement, {
      animation: 'fade',
      content: this.dropdown,
      duration: [200, 200],
      interactive: true,
      theme: 'dropdown',
      trigger: 'click',
    });
  }
}
