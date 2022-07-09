import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })

export class FriendshipService {

  constructor(private http: HttpClient) { }

  follow(userId: any): void {
    this.http.post('/api/friendship/follow', {
      userId: userId, session: localStorage.getItem('state'),
    }).subscribe();
  }

  unfollow(userId: any): void {
    this.http.post('/api/friendship/unfollow', {
      userId: userId, session: localStorage.getItem('state'),
    }).subscribe();
  }
}
