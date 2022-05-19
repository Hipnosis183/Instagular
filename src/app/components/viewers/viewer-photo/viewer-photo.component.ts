import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

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

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    // Go to the next item in the carousel if the right arrow key is pressed.
    if (event.key == 'ArrowRight') {
      if (this.feedPost.instagular.full.length > 1 && this.carouselIndex < this.feedPost.instagular.full.length - 1) {
        this.carouselNext();
      }
    }
    // Go to the previous item in the carousel if the left arrow key is pressed.
    if (event.key == 'ArrowLeft') {
      if (this.feedPost.instagular.full.length > 1 && this.carouselIndex > 0) {
        this.carouselPrev();
      }
    }
  }

  moreOptions = 0;

  openOptions(): void {
    this.moreOptions = 1;
  }

  closeOptions(): void {
    this.moreOptions = 0;
  }

  downloadMedia(): void {
    window.open(this.feedPost.instagular.full[this.carouselIndex] + '&se=0&dl=1', '_blank');
    this.moreOptions = 0;
  }

  ngOnInit(): void {
    this.carouselIndex = 0;
  }
}
