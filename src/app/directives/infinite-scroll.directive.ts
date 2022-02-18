import { AfterViewInit, Directive, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { delay, filter } from 'rxjs/operators';

@Directive({
  selector: '[infiniteScroll]'
})

export class InfiniteScrollDirective implements OnDestroy, OnInit, AfterViewInit {

  constructor(private element: ElementRef) { }

  @Input() stop?: boolean = false;
  @Output() intersect = new EventEmitter<HTMLElement>();

  private observer: IntersectionObserver | undefined;
  private subject$ = new Subject<{
    entry: IntersectionObserverEntry;
    observer: IntersectionObserver;
  }>();

  ngOnInit() {
    this.createObserver();
  }

  ngAfterViewInit() {
    this.initObserver();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['stop'].currentValue) {
      this.stopObserver();
    }
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = undefined;
    } this.subject$.complete();
  }

  private isIntersecting(element: HTMLElement) {
    return new Promise(resolve => {
      const observer = new IntersectionObserver(([entry]) => {
        resolve(entry.intersectionRatio === 1);
        observer.disconnect();
      });
      observer.observe(element);
    });
  }

  private createObserver() {
    const options = {
      rootMargin: '0px',
      threshold: 1,
    };
    const isIntersecting = (entry: IntersectionObserverEntry) =>
      entry.isIntersecting || entry.intersectionRatio > 0;
    this.observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (isIntersecting(entry)) {
          this.subject$.next({ entry, observer });
        }
      });
    }, options);
  }

  private initObserver() {
    if (!this.observer) { return; }
    this.observer.observe(this.element.nativeElement);
    this.subject$
      .pipe(delay(0), filter(Boolean))
      .subscribe(async ({ entry, observer }) => {
        const target = entry.target as HTMLElement;
        const isStillVisible = await this.isIntersecting(target);
        if (isStillVisible) { this.intersect.emit(target); }
      });
  }

  private stopObserver() {
    if (this.observer) {
      this.observer.unobserve(this.element.nativeElement);
      this.observer.disconnect();
    }
  }
}
