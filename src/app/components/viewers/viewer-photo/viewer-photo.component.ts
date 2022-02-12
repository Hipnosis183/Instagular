import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'viewer-photo',
  templateUrl: './viewer-photo.component.html',
  styleUrls: ['./viewer-photo.component.css']
})

export class ViewerPhotoComponent implements OnInit {

  constructor() { }

  @Input() feedPost: any;

  @Output() likeSend = new EventEmitter();
  @Output() unlikeSend = new EventEmitter();
  @Output() closeSend = new EventEmitter();

  carouselIndex = 0;

  carouselPrev(): void {
    this.carouselIndex--;
  }

  carouselNext(): void {
    this.carouselIndex++;
  }

  moreOptions = 0;

  openOptions(): void {
    this.moreOptions = 1;
  }

  closeOptions(): void {
    this.moreOptions = 0;
  }

  downloadMedia(): void {
    window.open(this.feedPost.instagular.download[this.carouselIndex], '_blank');
    this.moreOptions = 0;
  }

  ngOnInit(): void {
    this.carouselIndex = 0;
  }
}
