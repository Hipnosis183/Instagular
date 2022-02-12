import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'media-feed',
  templateUrl: './media-feed.component.html',
  styleUrls: ['./media-feed.component.css']
})

export class MediaFeedComponent implements OnInit {

  constructor(
    private http: HttpClient
  ) { }

  @Input() hideHeader: boolean = false;
  @Input() feedPosts: any[] = [];
  feedPost: any = null;

  openMedia(post: any): void {
    this.feedPost = post;
  }

  closeMedia(): void {
    this.feedPost = null;
  }

  private likeError() {
    return throwError(() => new Error('Media error: could not like the media.'));
  }

  likeMedia(id: string): void {
    this.http.post('/api/like', { session: localStorage.getItem("state"), mediaId: id })
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
    this.http.post('/api/unlike', { session: localStorage.getItem("state"), mediaId: id })
      .pipe(catchError(this.unlikeError))
      .subscribe((data) => {
        console.info('Media unliked successfully!');
        let i = this.feedPosts.findIndex((res) => res.id == id);
        this.feedPosts[i].has_liked = false;
      });
  }

  ngOnInit(): void {
  }
}
