import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'viewer-posts',
  templateUrl: './viewer-posts.component.html',
  styleUrls: ['./viewer-posts.component.css']
})

export class ViewerPostsComponent {

  constructor(
    private http: HttpClient,
    public store: StoreService,
  ) { }

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

  private likesError() {
    return throwError(() => {
      new Error('Likes error: couldn\'t toggle like/view counts.');
    });
  }

  likesHide(): void {
    this.feedPost.like_and_view_counts_disabled = true;
    this.http.post('/api/media/likes_hide', {
      id: this.feedPost.pk, session: localStorage.getItem('state'),
    }).pipe(catchError(this.likesError)).subscribe();
  }

  likesUnhide(): void {
    this.feedPost.like_and_view_counts_disabled = false;
    this.http.post('/api/media/likes_unhide', {
      id: this.feedPost.pk, session: localStorage.getItem('state'),
    }).pipe(catchError(this.likesError)).subscribe();
  }

  private commentsError() {
    return throwError(() => {
      new Error('Comments error: couldn\'t toggle comments visibility state.');
    });
  }

  commentsEnable(): void {
    this.feedPost.comment_count = 0;
    this.feedPost.comments_disabled = false;
    this.http.post('/api/media/comments_enable', {
      id: this.feedPost.pk, session: localStorage.getItem('state'),
    }).pipe(catchError(this.commentsError)).subscribe();
  }

  commentsDisable(): void {
    this.feedPost.comment_count = 0;
    this.feedPost.comments_disabled = true;
    this.feedPost.preview_comments = [];
    this.http.post('/api/media/comments_disable', {
      id: this.feedPost.pk, session: localStorage.getItem('state'),
    }).pipe(catchError(this.commentsError)).subscribe();
  }

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
