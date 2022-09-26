import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class FriendshipService {

  constructor(private http: HttpClient) { }

  async block(id: any): Promise<any> {
    return await lastValueFrom(
      this.http.post('/api/friendship/block', {
        id: id, session: localStorage.getItem('state'),
      })).then((data) => { return data; });
  }

  async favorite(id: any, option: string): Promise<any> {
    return await lastValueFrom(
      this.http.post('/api/friendship/favorite', {
        id: id, option: option, session: localStorage.getItem('state'),
      })).then((data) => { return data; });
  }

  async follow(id: any): Promise<any> {
    return await lastValueFrom(
      this.http.post('/api/friendship/follow', {
        id: id, session: localStorage.getItem('state'),
      })).then((data) => { return data; });
  }

  async mute(reel: any, post: any): Promise<any> {
    return await lastValueFrom(
      this.http.post('/api/friendship/mute', {
        reel: reel, post: post, session: localStorage.getItem('state'),
      })).then((data) => { return data; });
  }

  removeFollower(id: any): void {
    this.http.post('/api/friendship/remove_follower', {
      id: id, session: localStorage.getItem('state'),
    }).subscribe();
  }

  setBesties(add: any[], remove: any[]): void {
    this.http.post('/api/friendship/set_besties', {
      add: add, remove: remove, session: localStorage.getItem('state'),
    }).subscribe();
  }

  async unblock(id: any): Promise<any> {
    return await lastValueFrom(
      this.http.post('/api/friendship/unblock', {
        id: id, session: localStorage.getItem('state'),
      })).then((data) => { return data; });
  }

  async unfavorite(id: any, option: string): Promise<any> {
    return await lastValueFrom(
      this.http.post('/api/friendship/unfavorite', {
        id: id, option: option, session: localStorage.getItem('state'),
      })).then((data) => { return data; });
  }

  async unfollow(id: any): Promise<any> {
    return await lastValueFrom(
      this.http.post('/api/friendship/unfollow', {
        id: id, session: localStorage.getItem('state'),
      })).then((data) => { return data; });
  }

  async unmute(reel: any, post: any): Promise<any> {
    return await lastValueFrom(
      this.http.post('/api/friendship/unmute', {
        reel: reel, post: post, session: localStorage.getItem('state'),
      })).then((data) => { return data; });
  }

  updateFeedFavorites(add: any[], remove: any[]): void {
    this.http.post('/api/friendship/update_feed_favorites', {
      add: add, remove: remove, session: localStorage.getItem('state'),
    }).subscribe();
  }
}
