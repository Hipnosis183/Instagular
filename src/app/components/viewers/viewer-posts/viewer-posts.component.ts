import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'viewer-posts',
  templateUrl: './viewer-posts.component.html',
  styleUrls: ['./viewer-posts.component.css']
})

export class ViewerPostsComponent {

  constructor(public store: StoreService) { }

  @Input() feedPost: any;
  @Input() feedIndex: any;
  @Output() nextPost = new EventEmitter();
  @Output() prevPost = new EventEmitter();

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
    // Close side panel if the space key is pressed.
    if (event.key == ' ') { this.expandPanel(); }
    // Close viewer if the escape key is pressed.
    if (event.key == 'Escape') { this.closeSend.emit(); }
  }

  @Output() likeSend = new EventEmitter();
  @Output() unlikeSend = new EventEmitter();
  @Output() saveSend = new EventEmitter();
  @Output() unsaveSend = new EventEmitter();
  @Output() closeSend = new EventEmitter();

  saveMedia(feedPost: any, collection: any): void {
    const ids = { media: feedPost.id, collection: collection.collection_id };
    if (feedPost.saved_collection_ids) {
      !feedPost.saved_collection_ids.includes(collection.collection_id) ? this.saveSend.emit(ids) : this.unsaveSend.emit(ids);
    } else { this.saveSend.emit(ids); }
  }

  openMedia(): void {
    window.open(this.feedPost.instagular.full[this.carouselIndex] + '&se=0', '_blank');
  }

  downloadMedia(): void {
    window.open(this.feedPost.instagular.full[this.carouselIndex] + '&se=0&dl=1', '_blank');
  }

  collectionCreate: boolean = false;

  collectionCreateOpen(): void {
    this.collectionCreate = !this.collectionCreate;
  }

  collectionCreated(): void {
    // Reload collections.
    this.store.loadSaved();
    this.collectionCreate = false;
  }

  expandedPanel: boolean = true;

  expandPanel(): void {
    this.expandedPanel = !this.expandedPanel;
  }

  ngOnInit(): void {
    this.carouselIndex = 0;
  }
}
