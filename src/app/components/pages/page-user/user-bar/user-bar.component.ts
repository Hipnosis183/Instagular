import { Component, Input } from '@angular/core';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'user-bar',
  templateUrl: './user-bar.component.html',
  styleUrls: ['./user-bar.component.css']
})

export class UserBarComponent {

  constructor(public store: StoreService) { }

  intersecting: boolean = false;
  @Input() sentinel!: HTMLElement;

  intersectionObserver = new IntersectionObserver((entries) => {
    this.intersecting = entries[0].isIntersecting ? false : true;
  });

  scrollToTop(): void {
    let top: any = document.querySelector('.page-container');
    top.scrollTop = 0;
  }

  ngOnInit(): void {
    this.intersectionObserver.observe(this.sentinel);
  }
}
