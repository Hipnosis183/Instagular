import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'media-reels',
  templateUrl: './media-reels.component.html',
  styleUrls: ['./media-reels.component.css']
})

export class MediaReelsComponent implements OnInit {

  constructor(
    private http: HttpClient
  ) { }

  @Input() feedPosts: any[] = [];

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
    this.http.post('/api/media/like', { session: localStorage.getItem('state'), mediaId: id })
      .pipe(catchError(this.likeError))
      .subscribe((data) => {
        console.info('Media liked successfully!');
        this.feedPost.has_liked = true;
      });
  }

  private unlikeError() {
    return throwError(() => new Error('Media error: could not unlike the media.'));
  }

  unlikeMedia(id: string): void {
    this.http.post('/api/media/unlike', { session: localStorage.getItem('state'), mediaId: id })
      .pipe(catchError(this.unlikeError))
      .subscribe((data) => {
        console.info('Media unliked successfully!');
        this.feedPost.has_liked = false;
      });
  }

  ngOnChanges(): void {
    const cursor: any = localStorage.getItem('reels');
    this.hideIntersect = cursor ? false : true;
    this.stopIntersect = cursor ? false : true;
  }

  ngOnInit(): void {
  }
}
