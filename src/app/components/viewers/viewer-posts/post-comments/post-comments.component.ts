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

  @Input() feedPost: any;
  feedComments: any[] = [];
  showComments: boolean = false;
  loadedComments: boolean = false;
  loadedReplies: boolean = true;

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

  loadReplies(i: number): void {
    if (!this.loadedReplies) { return; }
    this.loadedReplies = false;
    this.http.post<string>('/api/feed/comments_replies', {
      mediaId: this.feedPost.pk, commentId: this.feedComments[i].pk,
      feed: JSON.stringify(this.stateComments[i]),
      session: localStorage.getItem('state'),
    }).pipe(catchError(this.commentsError)).subscribe((data: any) => {
      this.feedComments[i].preview_child_comments = this.stateComments[i]
        ? data.replies.concat(this.feedComments[i].preview_child_comments) : data.replies;
      this.stateComments[i] = JSON.parse(data.feed);
      this.loadedReplies = true;
    });
  }

  openComments(): void {
    if (!this.feedPost.comments_disabled) {
      if (!this.loadedComments) { this.loadComments(); }
      this.showComments = !this.showComments;
    }
  }

  repliesComments: any[] = [];
  stateComments: any[] = [];

  showReplies(i: number): void {
    if (this.repliesComments[i]) {
      this.repliesComments[i] = !this.repliesComments[i];
    } else { this.repliesComments[i] = true; }
    if (!this.loadedReplies) { return; }
    if (this.feedComments[i].preview_child_comments.length == 0) {
      this.loadReplies(i);
    }
  }

  textComment: string = '';
  sendingComment: boolean = false;

  sendComment(): void {
    if (!(this.textComment.length > 0) || this.sendingComment) { return; }
    this.sendingComment = true;
    this.http.post<string>('/api/media/comment', {
      mediaId: this.feedPost.pk, text: this.textComment,
      reply: this.commentReply.pk, session: localStorage.getItem('state'),
    }).pipe(catchError(this.commentsError)).subscribe((data: any) => {
      data.comment_like_count = 0;
      if (this.commentReply.pk) {
        data.child_comment_count = 0;
        data.preview_child_comments = [];
        const i = this.feedComments.findIndex((res) => res.pk == this.commentReply.reply ? this.commentReply.reply : this.commentReply.pk);
        if (this.feedComments[i].child_comment_count) {
          this.feedComments[i].child_comment_count++;
          this.feedComments[i].preview_child_comments.unshift(data);
        } else {
          this.feedComments[i].child_comment_count = 1;
          this.feedComments[i].preview_child_comments = [data];
        } this.repliesComments[i] = true;
      } else { this.feedComments.unshift(data); }
      this.feedPost.comment_count++;
      this.textComment = '';
      this.removeReply();
      this.sendingComment = false;
    });
  }

  commentReply: any = { pk: null, user: null, reply: null };

  removeReply(): void {
    this.commentReply = { pk: null, user: null, reply: null };
  }

  addReply(comment: any): void {
    if (comment.reply) {
      this.textComment = '@' + comment.user + ' ';
    } this.commentReply = comment;
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
    this.repliesComments = [];
    this.stateComments = [];
    this.feedComments = [];
    this.showComments = false;
    this.loadedComments = false;
    this.hideIntersect = true;
    this.stopIntersect = false;
    localStorage.removeItem('comments');
  }
}
