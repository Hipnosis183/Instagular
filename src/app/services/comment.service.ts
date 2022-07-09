import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class CommentService {

  constructor(private http: HttpClient) { }

  async create(mediaId: string, text: string, reply: string): Promise<void> {
    return await lastValueFrom(
      this.http.post('/api/comment/create', {
        mediaId: mediaId, text: text, reply: reply,
        session: localStorage.getItem('state'),
      })).then((data: any) => {
        data.comment_like_count = 0;
        if (reply) {
          data.child_comment_count = 0;
          data.preview_child_comments = [];
        } return data;
      });
  }

  delete(commentId: any, mediaId: any): void {
    this.http.post('/api/comment/delete', {
      mediaId: mediaId, commentId: commentId,
      session: localStorage.getItem('state'),
    }).subscribe();
  }

  like(comment: any): any {
    this.http.post('/api/comment/like', {
      id: comment.pk, session: localStorage.getItem('state'),
    }).subscribe();
    comment.has_liked_comment = true;
    comment.comment_like_count++;
    return comment;
  }

  unlike(comment: any): any {
    this.http.post('/api/comment/unlike', {
      id: comment.pk, session: localStorage.getItem('state'),
    }).subscribe();
    comment.has_liked_comment = false;
    comment.comment_like_count--;
    return comment;
  }

  commentsEnable(post: any): any {
    this.http.post('/api/comment/comments_enable', {
      id: post.pk, session: localStorage.getItem('state'),
    }).subscribe();
    post.comment_count = 0;
    post.comments_disabled = false;
    return post;
  }

  commentsDisable(post: any): any {
    this.http.post('/api/comment/comments_disable', {
      id: post.pk, session: localStorage.getItem('state'),
    }).subscribe();
    post.comment_count = 0;
    post.comments_disabled = true;
    post.preview_comments = [];
    return post;
  }
}
