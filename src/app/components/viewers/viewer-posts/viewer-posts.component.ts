import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'viewer-posts',
  templateUrl: './viewer-posts.component.html',
  styleUrls: ['./viewer-posts.component.css']
})

export class ViewerPostsComponent implements OnInit {

  constructor() { }

  @Input() feedPost: any;
  @Input() feedIndex: any;
  @Output() nextPost = new EventEmitter();
  @Output() prevPost = new EventEmitter();

  @Output() likeSend = new EventEmitter();
  @Output() unlikeSend = new EventEmitter();
  @Output() saveSend = new EventEmitter();
  @Output() unsaveSend = new EventEmitter();
  @Output() closeSend = new EventEmitter();

  carouselIndex = 0;

  carouselPrev(): void {
    this.carouselIndex--;
  }

  carouselNext(): void {
    this.carouselIndex++;
  }

  postPrev(): void {
    this.carouselIndex = 0;
    this.prevPost.emit();
  }

  postNext(): void {
    this.carouselIndex = 0;
    this.nextPost.emit();
  }

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    // Go to the next item in the carousel if the right arrow key is pressed.
    if (event.key == 'ArrowRight') {
      if (event.ctrlKey) {
        if (this.feedIndex.current < this.feedIndex.total) {
          this.postNext();
        }
      } else if (this.feedPost.instagular.full.length > 1 && this.carouselIndex < this.feedPost.instagular.full.length - 1) {
        this.carouselNext();
        // If the media is not a carousel, go to the next post.
      } else if (this.feedIndex.current < this.feedIndex.total) {
        this.postNext();
      }
    }
    // Go to the previous item in the carousel if the left arrow key is pressed.
    if (event.key == 'ArrowLeft') {
      if (event.ctrlKey) {
        if (this.feedIndex.current > 0) {
          this.postPrev();
        }
      } else if (this.feedPost.instagular.full.length > 1 && this.carouselIndex > 0) {
        this.carouselPrev();
        // If the media is not a carousel, go to the previous post.
      } else if (this.feedIndex.current > 0) {
        this.postPrev();
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

  openMedia(): void {
    window.open(this.feedPost.instagular.full[this.carouselIndex] + '&se=0', '_blank');
  }

  downloadMedia(): void {
    window.open(this.feedPost.instagular.full[this.carouselIndex] + '&se=0&dl=1', '_blank');
    this.moreOptions = 0;
  }

  ngOnInit(): void {
    this.carouselIndex = 0;
  }
}
