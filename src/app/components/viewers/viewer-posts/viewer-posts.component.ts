import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'viewer-posts',
  templateUrl: './viewer-posts.component.html',
  styleUrls: ['./viewer-posts.component.css']
})

export class ViewerPostsComponent {

  @Input() feedPost: any;
  @Input() feedIndex: any;
  @Output() onClose = new EventEmitter();
  @Output() onNextPost = new EventEmitter();
  @Output() onPrevPost = new EventEmitter();

  @Output() onPin = new EventEmitter();
  @Output() onUnpin = new EventEmitter();
  @Output() onFollow = new EventEmitter();
  @Output() onBesties = new EventEmitter();
  @Output() onFavorite = new EventEmitter();

  carouselIndex = 0;
  expandedPanel: boolean = true;

  carouselPrev(): void {
    this.carouselIndex--;
  }

  carouselNext(): void {
    this.carouselIndex++;
  }

  postPrev(): void {
    this.carouselIndex = 0;
    this.onPrevPost.emit();
  }

  postNext(): void {
    this.carouselIndex = 0;
    this.onNextPost.emit();
  }

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    // Return if an input element is being focused.
    if (document.activeElement?.nodeName == 'INPUT') { return; }
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
    // Close side panel if the space key is pressed.
    if (event.key == ' ') { this.expandedPanel = !this.expandedPanel; }
    // Close viewer if the escape key is pressed.
    if (event.key == 'Escape') { this.onClose.emit(); }
  }

  openMedia(): void {
    window.open(this.feedPost.instagular.full[this.carouselIndex] + '&se=0', '_blank');
  }

  ngOnInit(): void {
    this.carouselIndex = 0;
  }
}
