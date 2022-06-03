import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import store from 'src/app/app.store';

@Injectable({ providedIn: 'root' })

export class StoreService {

  constructor(private http: HttpClient) { }
  state: any = store;

  private savedError() {
    return throwError(() => new Error('Saved error: cannot load user saved posts feed.'));
  }

  loadSaved(more?: boolean): void {
    if (!more) { localStorage.removeItem('saved'); }
    this.http.post<any>('/api/feed/saved', { feed: localStorage.getItem('saved'), id: localStorage.getItem('userpk'), session: localStorage.getItem('state') })
      .pipe(catchError(this.savedError))
      .subscribe((data: any) => {
        console.info('User saved feed loaded successfully!');
        localStorage.setItem('saved', data.feed);
        store.savedPosts = more ? store.savedPosts.concat(data.collections) : data.collections;
      });
  }
}
