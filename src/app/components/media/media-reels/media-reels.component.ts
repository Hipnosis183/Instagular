import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'media-reels',
  templateUrl: './media-reels.component.html',
  styleUrls: ['./media-reels.component.css']
})

export class MediaReelsComponent {

  constructor(private http: HttpClient) { }

  feedIndex: any = { current: null, total: null };
  feedPost: any = null;
  @Input() feedPosts: any[] = [];

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
    this.feedPost.has_liked = true;
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
    this.feedPost.has_liked = false;
    this.http.post('/api/media/unlike', {
      mediaId: id, session: localStorage.getItem('state'),
    }).pipe(catchError(this.unlikeError)).subscribe();
  }

  hideIntersect: boolean = true;
  stopIntersect: boolean = false;
  @Output() onScroll = new EventEmitter();

  onIntersection(): void {
    this.hideIntersect = true;
    this.onScroll.emit();
  }

  ngOnChanges(): void {
    const cursor: any = localStorage.getItem('reels');
    this.hideIntersect = cursor ? false : true;
    this.stopIntersect = cursor ? false : true;
  }
}
