import { Directive, ElementRef } from '@angular/core';

@Directive({ selector: '[autoFocus]' })

export class AutoFocusDirective {

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit(): void {
    this.elementRef.nativeElement.focus();
  }
}
