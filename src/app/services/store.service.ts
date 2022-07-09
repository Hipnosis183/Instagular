import { Injectable } from '@angular/core';
import { FeedService } from 'src/app/services/feed.service';
import store from 'src/app/app.store';

@Injectable({ providedIn: 'root' })

export class StoreService {

  constructor(private feed: FeedService) { }
  state: any = store;

  loadSaved(more?: boolean): void {
    if (!more) { localStorage.removeItem('saved'); }
    this.feed.saved().then((data: any) => {
      store.savedPosts = more ? store.savedPosts.concat(data.collections) : data.collections;
    });
  }
}
