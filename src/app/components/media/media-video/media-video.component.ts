import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'media-video',
  templateUrl: './media-video.component.html',
  styleUrls: ['./media-video.component.css']
})

export class MediaVideoComponent {

  constructor(private http: HttpClient) { }

  feedIndex: any = { current: null, total: null };
  feedPost: any = null;
  @Input() feedPosts: any[] = [];

  private mediaError() {
    return throwError(() => {
      new Error('Media error: could not load media information.');
    });
  }

  openMedia(post: any): void {
    // If the media information hasn't been requested yet.
    if (!post.node.instagular) {
      this.http.post('/api/media/video', {
        id: post.node.shortcode, session: localStorage.getItem('state'),
      }).pipe(catchError(this.mediaError)).subscribe((data) => {
        this.feedPost = data;
        this.feedIndex.current = this.feedPosts.findIndex((res) => res.node.id == post.node.id);
        this.feedIndex.total = this.feedPosts.length - 1;
        // Store results to avoid further request for the selected media.
        this.feedPosts[this.feedIndex.current].node.instagular = data;
      });
    } else {
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
      this.http.post('/api/media/video', {
        id: this.feedPosts[this.feedIndex.current].node.shortcode,
        session: localStorage.getItem('state'),
      }).pipe(catchError(this.mediaError)).subscribe((data) => {
        this.feedPost = data;
        // Store results to avoid further request for the selected media.
        this.feedPosts[this.feedIndex.current].node.instagular = data;
      });
    } else {
      this.feedPost = this.feedPosts[this.feedIndex.current].node.instagular;
    }
  }

  nextPost(): void {
    this.feedIndex.current++;
    // If the media information hasn't been requested yet.
    if (!this.feedPosts[this.feedIndex.current].node.instagular) {
      this.http.post('/api/media/video', {
        id: this.feedPosts[this.feedIndex.current].node.shortcode,
        session: localStorage.getItem('state'),
      }).pipe(catchError(this.mediaError)).subscribe((data) => {
        this.feedPost = data;
        // Store results to avoid further request for the selected media.
        this.feedPosts[this.feedIndex.current].node.instagular = data;
      });
    } else {
      this.feedPost = this.feedPosts[this.feedIndex.current].node.instagular;
    }
  }

  private likeError() {
    return throwError(() => {
      new Error('Media error: could not like the media.');
    });
  }

  likeMedia(id: string): void {
    this.http.post('/api/media/like', {
      mediaId: id, session: localStorage.getItem('state'),
    }).pipe(catchError(this.likeError)).subscribe(() => {
      this.feedPost.has_liked = true;
    });
  }

  private unlikeError() {
    return throwError(() => {
      new Error('Media error: could not unlike the media.');
    });
  }

  unlikeMedia(id: string): void {
    this.http.post('/api/media/unlike', {
      mediaId: id, session: localStorage.getItem('state'),
    }).pipe(catchError(this.unlikeError)).subscribe(() => {
      this.feedPost.has_liked = false;
    });
  }

  hideIntersect: boolean = true;
  stopIntersect: boolean = false;
  @Output() onScroll = new EventEmitter();

  onIntersection(): void {
    this.hideIntersect = true;
    this.onScroll.emit();
  }

  ngOnChanges(): void {
    const feed: any = localStorage.getItem('video');
    this.hideIntersect = JSON.parse(feed).moreAvailable ? false : true;
    this.stopIntersect = JSON.parse(feed).moreAvailable ? false : true;
  }
}
