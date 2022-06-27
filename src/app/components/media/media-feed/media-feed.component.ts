import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'media-feed',
  templateUrl: './media-feed.component.html',
  styleUrls: ['./media-feed.component.css']
})

export class MediaFeedComponent {

  constructor(
    private http: HttpClient,
    private store: StoreService,
  ) { }

  feedIndex: any = { current: null, total: null };
  feedPost: any = null;
  @Input() feedPosts: any[] = [];
  @Input() hideHeader: boolean = false;

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

  private likeError() {
    return throwError(() => {
      new Error('Media error: could not like the media.');
    });
  }

  likeMedia(id: string): void {
    let i = this.feedPosts.findIndex((res) => res.id == id);
    this.feedPosts[i].has_liked = true;
    this.http.post('/api/media/like', {
      mediaId: id, session: localStorage.getItem('state'),
    }).pipe(catchError(this.likeError)).subscribe();
  }

  private unlikeError() {
    return throwError(() => {
      new Error('Media error: could not unlike the media.');
    });
  }

  unlikeMedia(id: string): void {
    let i = this.feedPosts.findIndex((res) => res.id == id);
    this.feedPosts[i].has_liked = false;
    this.http.post('/api/media/unlike', {
      mediaId: id, session: localStorage.getItem('state'),
    }).pipe(catchError(this.unlikeError)).subscribe();
  }

  private saveError() {
    return throwError(() => {
      new Error('Media error: could not save the media.');
    });
  }

  saveMedia(ids: any): void {
    let i = this.feedPosts.findIndex((res) => res.id == ids.media);
    this.feedPosts[i].has_viewer_saved = true;
    if (ids.collection) {
      if (this.feedPosts[i].saved_collection_ids) {
        this.feedPosts[i].saved_collection_ids.push(ids.collection);
      } else { this.feedPosts[i].saved_collection_ids = [ids.collection]; }
    }
    this.http.post('/api/media/save', {
      collectionId: ids.collection, mediaId: ids.media,
      session: localStorage.getItem('state'),
    }).pipe(catchError(this.saveError)).subscribe(() => {
      this.store.loadSaved();
    });
  }

  private unsaveError() {
    return throwError(() => {
      new Error('Media error: could not unsave the media.');
    });
  }

  unsaveMedia(ids: any): void {
    let i = this.feedPosts.findIndex((res) => res.id == ids.media);
    this.feedPosts[i].has_viewer_saved = ids.collection ? true : false;
    if (ids.collection) {
      let k = this.feedPosts[i].saved_collection_ids.indexOf(ids.collection);
      this.feedPosts[i].saved_collection_ids.splice(k, 1);
    } else { this.feedPosts[i].saved_collection_ids = []; }
    this.http.post('/api/media/unsave', {
      collectionId: ids.collection, mediaId: ids.media,
      session: localStorage.getItem('state'),
    }).pipe(catchError(this.unsaveError)).subscribe(() => {
      this.store.loadSaved();
    });
  }

  hideIntersect: boolean = true;
  stopIntersect: boolean = false;
  @Output() onScroll = new EventEmitter();

  onIntersection(): void {
    this.hideIntersect = true;
    this.onScroll.emit();
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
}
