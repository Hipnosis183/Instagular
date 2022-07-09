import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class UserService {

  constructor(private http: HttpClient) { }

  postPin(post: any): any {
    this.http.post('/api/user/post_pin', {
      id: post.pk, session: localStorage.getItem('state'),
    }).subscribe();
    post.timeline_pinned_user_ids = [post.user.pk];
    return post;
  }

  postUnpin(post: any): any {
    this.http.post('/api/user/post_unpin', {
      id: post.pk, session: localStorage.getItem('state'),
    }).subscribe();
    post.timeline_pinned_user_ids = null;
    return post;
  }

  async profile(id?: any): Promise<any> {
    return await lastValueFrom(
      this.http.post('/api/user/profile', {
        id: id, session: localStorage.getItem('state'),
      })).then((data) => { return data; });
  }
}
