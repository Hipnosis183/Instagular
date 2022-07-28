import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import store from 'src/app/app.store';

@Injectable({ providedIn: 'root' })

export class FeedService {

  constructor(private http: HttpClient) { }

  async comments(id: string): Promise<any> {
    return await lastValueFrom(
      this.http.post('/api/feed/comments', {
        id: id, feed: localStorage.getItem('comments'),
        session: localStorage.getItem('state'),
      })).then((data: any) => {
        localStorage.setItem('comments', data.feed);
        return data;
      });
  }

  async commentsReplies(mediaId: string, commentId: string, feed: string): Promise<any> {
    return await lastValueFrom(
      this.http.post('/api/feed/comments_replies', {
        mediaId: mediaId, commentId: commentId,
        feed: JSON.stringify(feed),
        session: localStorage.getItem('state'),
      })).then((data) => { return data; });
  }

  async followers(id: any): Promise<any> {
    return await lastValueFrom(
      this.http.post('/api/feed/followers', {
        id: id, feed: localStorage.getItem('followers'),
        session: localStorage.getItem('state'),
      })).then((data: any) => {
        localStorage.setItem('followers', data.feed);
        return data;
      });
  }

  async following(id: any): Promise<any> {
    return await lastValueFrom(
      this.http.post('/api/feed/following', {
        id: id, feed: localStorage.getItem('following'),
        session: localStorage.getItem('state'),
      })).then((data: any) => {
        localStorage.setItem('following', data.feed);
        return data;
      });
  }

  async reels(id: any): Promise<any> {
    return await lastValueFrom(
      this.http.post('/api/feed/reels', {
        id: id, cursor: localStorage.getItem('reels'),
        session: localStorage.getItem('state'),
      })).then((data: any) => {
        localStorage.setItem('reels', data.cursor);
        return data;
      });
  }

  async reelsMedia(stories: any[]): Promise<any> {
    return await lastValueFrom(
      this.http.post('/api/feed/reels_media', {
        stories: stories, session: localStorage.getItem('state'),
      })).then((data) => { return data; });
  }

  async reelsTray(): Promise<any> {
    return await lastValueFrom(
      this.http.post('/api/feed/reels_tray', {
        session: localStorage.getItem('state'),
      })).then((data) => { return data; });
  }

  async saved(): Promise<void> {
    return await lastValueFrom(
      this.http.post('/api/feed/saved', {
        feed: localStorage.getItem('saved'),
        id: store.userProfile.pk,
        session: localStorage.getItem('state'),
      })).then((data: any) => {
        localStorage.setItem('saved', data.feed);
        return data;
      });
  }

  async savedAll(feed: string): Promise<void> {
    return await lastValueFrom(
      this.http.post('/api/feed/saved_all', {
        feed: localStorage.getItem(feed),
        session: localStorage.getItem('state'),
      })).then((data: any) => {
        localStorage.setItem(feed, data.feed);
        return data;
      });
  }

  async savedCollection(id: string): Promise<void> {
    return await lastValueFrom(
      this.http.post('/api/feed/saved_collection', {
        feed: localStorage.getItem('collection'), id: id,
        session: localStorage.getItem('state'),
      })).then((data: any) => {
        localStorage.setItem('collection', data.feed);
        return data;
      });
  }

  async tagged(id: any): Promise<any> {
    return await lastValueFrom(
      this.http.post('/api/feed/tagged', {
        feed: localStorage.getItem('tagged'), id: id,
        session: localStorage.getItem('state'),
      })).then((data: any) => {
        localStorage.setItem('tagged', data.feed);
        return data;
      });
  }

  async timeline(): Promise<any> {
    return await lastValueFrom(
      this.http.post('/api/feed/timeline', {
        feed: localStorage.getItem('feed'),
        session: localStorage.getItem('state'),
      })).then((data: any) => {
        localStorage.setItem('feed', data.feed);
        return data;
      });
  }

  async user(id: any): Promise<any> {
    return await lastValueFrom(
      this.http.post('/api/feed/user', {
        feed: localStorage.getItem('feed'), id: id,
        session: localStorage.getItem('state'),
      })).then((data: any) => {
        localStorage.setItem('feed', data.feed);
        return data;
      });
  }

  async video(id: any, name: any): Promise<any> {
    return await lastValueFrom(
      this.http.post('/api/feed/video', {
        id: id, name: name,
        feed: localStorage.getItem('video'),
        session: localStorage.getItem('state'),
      })).then((data: any) => {
        localStorage.setItem('video', data.feed);
        return data;
      });
  }
}
