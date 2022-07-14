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

  setBesties(add: any[], remove: any[]): void {
    this.http.post('/api/friendship/setBesties', {
      add: add, remove: remove, session: localStorage.getItem('state'),
    }).subscribe();
  }

  unfollow(id: any): void {
    this.http.post('/api/friendship/unfollow', {
      id: id, session: localStorage.getItem('state'),
    }).subscribe();
  }

  updateFeedFavorites(add: any[], remove: any[]): void {
    this.http.post('/api/friendship/updateFeedFavorites', {
      add: add, remove: remove, session: localStorage.getItem('state'),
    }).subscribe();
  }
}
