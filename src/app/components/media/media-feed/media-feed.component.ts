import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'media-feed',
  templateUrl: './media-feed.component.html',
  styleUrls: ['./media-feed.component.css']
})

export class MediaFeedComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private store: StoreService
  ) { }

  @Input() feedPosts: any[] = [];
  @Input() hideHeader: boolean = false;
  @Output() onScroll = new EventEmitter();

  feedPost: any = null;
  feedIndex: any = { current: null, total: null };

  openMedia(post: any): void {
    this.feedPost = post;
    this.feedIndex.current = this.feedPosts.findIndex((res) => res.id == post.id);
    this.feedIndex.total = this.feedPosts.length - 1;
  }

  closeMedia(): void {
    this.feedPost = null;
  }

  prevPost(): void {
    this.feedIndex.current--;
    this.feedPost = this.feedPosts[this.feedIndex.current];
  }

  nextPost(): void {
    this.feedIndex.current++;
    this.feedPost = this.feedPosts[this.feedIndex.current];
  }

  hideIntersect: boolean = true;
  stopIntersect: boolean = false;

  onIntersection(): void {
    this.hideIntersect = true;
    this.onScroll.emit();
  }

  private likeError() {
    return throwError(() => new Error('Media error: could not like the media.'));
  }

  likeMedia(id: string): void {
    this.http.post('/api/media/like', { session: localStorage.getItem("state"), mediaId: id })
      .pipe(catchError(this.likeError))
      .subscribe((data) => {
        console.info('Media liked successfully!');
        let i = this.feedPosts.findIndex((res) => res.id == id);
        this.feedPosts[i].has_liked = true;
      });
  }

  private unlikeError() {
    return throwError(() => new Error('Media error: could not unlike the media.'));
  }

  unlikeMedia(id: string): void {
    this.http.post('/api/media/unlike', { session: localStorage.getItem("state"), mediaId: id })
      .pipe(catchError(this.unlikeError))
      .subscribe((data) => {
        console.info('Media unliked successfully!');
        let i = this.feedPosts.findIndex((res) => res.id == id);
        this.feedPosts[i].has_liked = false;
      });
  }

  private saveError() {
    return throwError(() => new Error('Media error: could not save the media.'));
  }

  saveMedia(ids: any): void {
    this.http.post('/api/media/save', { session: localStorage.getItem("state"), mediaId: ids.media, collectionId: ids.collection })
      .pipe(catchError(this.saveError))
      .subscribe((data) => {
        console.info('Media saved successfully!');
        let i = this.feedPosts.findIndex((res) => res.id == ids.media);
        this.feedPosts[i].has_viewer_saved = true;
        if (ids.collection) {
          if (this.feedPosts[i].saved_collection_ids) {
            this.feedPosts[i].saved_collection_ids.push(ids.collection);
          } else {
            this.feedPosts[i].saved_collection_ids = [ids.collection];
          }
        }
        this.store.loadSaved();
      });
  }

  private unsaveError() {
    return throwError(() => new Error('Media error: could not unsave the media.'));
  }

  unsaveMedia(ids: any): void {
    this.http.post('/api/media/unsave', { session: localStorage.getItem("state"), mediaId: ids.media, collectionId: ids.collection })
      .pipe(catchError(this.unsaveError))
      .subscribe((data) => {
        console.info('Media unsaved successfully!');
        let i = this.feedPosts.findIndex((res) => res.id == ids.media);
        this.feedPosts[i].has_viewer_saved = ids.collection ? true : false;
        if (ids.collection) {
          this.feedPosts[i].saved_collection_ids.splice(this.feedPosts[i].saved_collection_ids.indexOf(ids.collection), 1);
        } else {
          this.feedPosts[i].saved_collection_ids = [];
        }
        this.store.loadSaved();
      });
  }

  @Input() feedStorage: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (this.feedStorage.length > 0) {
      const feed: any = localStorage.getItem(this.feedStorage);
      this.hideIntersect = JSON.parse(feed).moreAvailable ? false : true;
      this.stopIntersect = JSON.parse(feed).moreAvailable ? false : true;
    }
    else if (!changes['feedPosts'].firstChange) {
      const feed: any = localStorage.getItem('feed');
      this.hideIntersect = JSON.parse(feed).moreAvailable ? false : true;
      this.stopIntersect = JSON.parse(feed).moreAvailable ? false : true;
    }
  }

  ngOnInit(): void {
  }
}
