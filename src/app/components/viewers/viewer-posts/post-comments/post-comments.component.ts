import { Component, Input } from '@angular/core';
import { CommentService } from 'src/app/services/comment.service';
import { FeedService } from 'src/app/services/feed.service';

@Component({
  selector: 'post-comments',
  templateUrl: './post-comments.component.html',
  styleUrls: ['./post-comments.component.css']
})

export class PostCommentsComponent {

  constructor(
    private comment: CommentService,
    private feed: FeedService,
  ) { }

  @Input() feedPost: any;
  feedComments: any[] = [];
  showComments: boolean = false;
  loadedComments: boolean = false;
  loadedReplies: boolean = true;

  loadComments(): void {
    this.loadedComments = true;
    this.feed.comments(this.feedPost.pk).then((data: any) => {
      this.feedComments = this.feedComments.concat(data.comments);
      this.onUpdated();
    });
  }

  loadReplies(i: number): void {
    if (!this.loadedReplies) { return; }
    this.loadedReplies = false;
    this.feed.commentsReplies(this.feedPost.pk, this.feedComments[i].pk,
      this.stateComments[i]).then((data: any) => {
        this.feedComments[i].preview_child_comments = this.stateComments[i]
          ? data.replies.concat(this.feedComments[i].preview_child_comments) : data.replies;
        this.stateComments[i] = JSON.parse(data.feed);
        this.loadedReplies = true;
      });
  }

  openComments(): void {
    if (this.feedPost.comment_count > 0) {
      if (!this.feedPost.comments_disabled) {
        if (!this.loadedComments) { this.loadComments(); }
        this.showComments = !this.showComments;
      }
    }
  }

  textComment: string = '';
  sendingComment: boolean = false;

  sendComment(): void {
    if (!(this.textComment.length > 0) || this.sendingComment) { return; }
    this.sendingComment = true;
    this.comment.create(this.feedPost.pk, this.textComment, this.commentReply.pk).then((data) => {
      if (this.commentReply.pk) {
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

  commentDelete(comment: any, i: number): void {
    if (comment.reply) {
      const k = this.feedComments[i].preview_child_comments.findIndex((res: any) => res.pk == comment.pk);
      this.feedComments[i].preview_child_comments.splice(k, 1);
      this.feedComments[i].child_comment_count--;
      this.feedPost.comment_count--;
    } else {
      this.feedPost.comment_count -= this.feedComments[i].child_comment_count + 1;
      this.feedComments.splice(i, 1);
    } this.comment.delete(comment.pk, this.feedPost.pk);
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
