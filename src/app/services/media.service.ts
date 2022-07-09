import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { StoreService } from 'src/app/services/store.service';

@Injectable({ providedIn: 'root' })

export class MediaService {

  constructor(
    private http: HttpClient,
    public store: StoreService,
  ) { }

  like(post: any): any {
    this.http.post('/api/media/like', {
      mediaId: post.id, session: localStorage.getItem('state'),
    }).subscribe();
    post.has_liked = true;
    post.like_count++;
    return post;
  }

  unlike(post: any): any {
    this.http.post('/api/media/unlike', {
      mediaId: post.id, session: localStorage.getItem('state'),
    }).subscribe();
    post.has_liked = false;
    post.like_count--;
    return post;
  }

  likesHide(post: any): any {
    this.http.post('/api/media/likes_hide', {
      id: post.pk, session: localStorage.getItem('state'),
    }).subscribe();
    post.like_and_view_counts_disabled = true;
    return post;
  }

  likesUnhide(post: any): any {
    this.http.post('/api/media/likes_unhide', {
      id: post.pk, session: localStorage.getItem('state'),
    }).subscribe();
    post.like_and_view_counts_disabled = false;
    return post;
  }

  save(post: any, collection?: string): any {
    this.http.post('/api/media/save', {
      collectionId: collection, mediaId: post.id,
      session: localStorage.getItem('state'),
    }).subscribe(() => { this.store.loadSaved(); });
    post.has_viewer_saved = true;
    if (collection) {
      if (post.saved_collection_ids) {
        post.saved_collection_ids.push(collection);
      } else { post.saved_collection_ids = [collection]; }
    } return post;
  }

  unsave(post: any, collection?: string): any {
    this.http.post('/api/media/unsave', {
      collectionId: collection, mediaId: post.id,
      session: localStorage.getItem('state'),
    }).subscribe(() => { this.store.loadSaved(); });
    post.has_viewer_saved = collection ? true : false;
    if (collection) {
      let k = post.saved_collection_ids.indexOf(collection);
      post.saved_collection_ids.splice(k, 1);
    } else { post.saved_collection_ids = []; }
    return post;
  }

  seen(stories: any): any {
    this.http.post('/api/media/seen', {
      stories: stories, session: localStorage.getItem('state'),
    }).subscribe();
  }

  async video(id: string): Promise<any> {
    return await lastValueFrom(
      this.http.post('/api/media/video', {
        id: id, session: localStorage.getItem('state'),
      })).then((data) => { return data; });
  }
}
