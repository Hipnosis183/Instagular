import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'media-video',
  templateUrl: './media-video.component.html',
  styleUrls: ['./media-video.component.css']
})

export class MediaVideoComponent implements OnInit {

  constructor(
    private http: HttpClient
  ) { }

  @Input() feedPosts: any[] = [];

  @Output() onScroll = new EventEmitter();

  feedPost: any = null;
  feedIndex: any = { current: null, total: null };

  private mediaError() {
    return throwError(() => new Error('Media error: could not load media information.'));
  }

  openMedia(post: any): void {
    // If the media information hasn't been requested yet.
    if (!post.node.instagular) {
      this.http.post('/api/media/video', { session: localStorage.getItem('state'), id: post.node.shortcode })
        .pipe(catchError(this.mediaError))
        .subscribe((data) => {
          console.info('Media information loaded successfully!');
          this.feedPost = data;
          this.feedIndex.current = this.feedPosts.findIndex((res) => res.node.id == post.node.id);
          this.feedIndex.total = this.feedPosts.length - 1;
          // Store results to avoid further request for the selected media.
          this.feedPosts[this.feedIndex.current].node.instagular = data;
        });
    } else {
      console.info('Media information already loaded.');
      this.feedIndex.current = this.feedPosts.findIndex((res) => res.node.id == post.node.id);
      this.feedPost = this.feedPosts[this.feedIndex.current].node.instagular;
    }
  }

  closeMedia(): void {
    this.feedPost = null;
  }

  prevPost(): void {
    this.feedIndex.current--;
    // If the media information hasn't been requested yet.
    if (!this.feedPosts[this.feedIndex.current].node.instagular) {
      this.http.post('/api/media/video', { session: localStorage.getItem('state'), id: this.feedPosts[this.feedIndex.current].node.shortcode })
        .pipe(catchError(this.mediaError))
        .subscribe((data) => {
          console.info('Media information loaded successfully!');
          this.feedPost = data;
          // Store results to avoid further request for the selected media.
          this.feedPosts[this.feedIndex.current].node.instagular = data;
        });
    } else {
      console.info('Media information already loaded.')
      this.feedPost = this.feedPosts[this.feedIndex.current].node.instagular;
    }
  }

  nextPost(): void {
    this.feedIndex.current++;
    // If the media information hasn't been requested yet.
    if (!this.feedPosts[this.feedIndex.current].node.instagular) {
      this.http.post('/api/media/video', { session: localStorage.getItem('state'), id: this.feedPosts[this.feedIndex.current].node.shortcode })
        .pipe(catchError(this.mediaError))
        .subscribe((data) => {
          console.info('Media information loaded successfully!');
          this.feedPost = data;
          // Store results to avoid further request for the selected media.
          this.feedPosts[this.feedIndex.current].node.instagular = data;
        });
    } else {
      console.info('Media information already loaded.')
      this.feedPost = this.feedPosts[this.feedIndex.current].node.instagular;
    }
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
    const feed: any = localStorage.getItem('video');
    this.hideIntersect = JSON.parse(feed).moreAvailable ? false : true;
    this.stopIntersect = JSON.parse(feed).moreAvailable ? false : true;
  }

  ngOnInit(): void {
  }
}
