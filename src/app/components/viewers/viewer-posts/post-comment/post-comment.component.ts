import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'post-comment',
  templateUrl: './post-comment.component.html',
  styleUrls: ['./post-comment.component.css']
})

export class PostCommentComponent {

  constructor(private http: HttpClient) { }

  @Input() comment: any;
  @Input() small: boolean = false;

  private likeError() {
    return throwError(() => {
      new Error('Comment error: could not like the comment.');
    });
  }

  likeComment(): void {
    this.comment.has_liked_comment = true;
    this.comment.comment_like_count++;
    this.http.post('/api/media/like_comment', {
      id: this.comment.pk, session: localStorage.getItem('state'),
    }).pipe(catchError(this.likeError)).subscribe();
  }

  private unlikeError() {
    return throwError(() => {
      new Error('Comment error: could not unlike the comment.');
    });
  }

  unlikeComment(): void {
    this.comment.has_liked_comment = false;
    this.comment.comment_like_count--;
    this.http.post('/api/media/unlike_comment', {
      id: this.comment.pk, session: localStorage.getItem('state'),
    }).pipe(catchError(this.unlikeError)).subscribe();
  }
}
