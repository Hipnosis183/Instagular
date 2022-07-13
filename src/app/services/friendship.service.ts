import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })

export class FriendshipService {

  constructor(private http: HttpClient) { }

  follow(id: any): void {
    this.http.post('/api/friendship/follow', {
      id: id, session: localStorage.getItem('state'),
    }).subscribe();
  }

  removeFollower(id: any): void {
    this.http.post('/api/friendship/removeFollower', {
      id: id, session: localStorage.getItem('state'),
    }).subscribe();
  }

  unfollow(id: any): void {
    this.http.post('/api/friendship/unfollow', {
      id: id, session: localStorage.getItem('state'),
    }).subscribe();
  }
}
