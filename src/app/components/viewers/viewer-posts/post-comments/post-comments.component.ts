import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'post-comments',
  templateUrl: './post-comments.component.html',
  styleUrls: ['./post-comments.component.css']
})

export class PostCommentsComponent {

  constructor(private http: HttpClient) { }

  replyComments: any[] = [];

  showReplies(index: number): void {
    if (this.replyComments[index]) {
      this.replyComments[index] = !this.replyComments[index];
    } else { this.replyComments[index] = true; }
  }

  @Input() feedPost: any;
  feedComments: any[] = [];
  showComments: boolean = false;
  loadedComments: boolean = false;

  private commentsError() {
    return throwError(() => {
      new Error('Comments error: cannot load post comments.');
    });
  }

  loadComments(): void {
    this.loadedComments = true;
    this.http.post<string>('/api/feed/comments', {
      id: this.feedPost.pk, feed: localStorage.getItem('comments'),
      session: localStorage.getItem('state'),
    }).pipe(catchError(this.commentsError)).subscribe((data: any) => {
      localStorage.setItem('comments', data.feed);
      this.feedComments = this.feedComments.concat(data.comments);
      this.onUpdated();
    });
  }

  openComments(): void {
    if (!this.feedPost.comments_disabled) {
      if (!this.loadedComments) { this.loadComments(); }
      this.showComments = !this.showComments;
    }
  }

  hideIntersect: boolean = true;
  stopIntersect: boolean = false;

  onIntersection(): void {
    this.hideIntersect = true;
    this.loadComments();
  }

  onUpdated(): void {
    const feed: any = localStorage.getItem('comments');
    this.hideIntersect = JSON.parse(feed).moreAvailable ? false : true;
    this.stopIntersect = JSON.parse(feed).moreAvailable ? false : true;
  }

  ngOnChanges(): void {
    this.replyComments = [];
    this.feedComments = [];
    this.showComments = false;
    this.loadedComments = false;
    this.hideIntersect = true;
    this.stopIntersect = false;
    localStorage.removeItem('comments');
  }
}
