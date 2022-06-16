import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { StoreService } from 'src/app/services/store.service';
import { debounce } from 'src/app/utils/debounce';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class SearchComponent {

  constructor(
    private http: HttpClient,
    public router: Router,
    public store: StoreService,
  ) { }

  @Input() small: boolean = false;

  isLoading = false;
  queryResults: any[] = [];
  queryFinished: boolean = true;
  searchRecent: any[] = this.store.state.recentSearches;
  selectModel: string = '';

  private updateError() {
    return throwError(() => {
      new Error('User error: cannot load user media.');
    });
  }

  _updateValue() {
    this.isLoading = true;
    this.updateValueDebounced();
  }
  updateValueDebounced = debounce(() => this.updateValue(), 2000);
  updateValue(): void {
    if (this.selectModel && this.selectModel.length > 0) {
      this.http.post<any>('/api/search/users', {
        query: this.selectModel,
        session: localStorage.getItem('state'),
      }).pipe(catchError(this.updateError)).subscribe((data) => {
        this.queryResults = data;
        this.queryFinished = true;
        this.isLoading = false;
      });
    } else {
      this.queryResults = this.store.state.recentSearches;
      this.isLoading = false;
    }
  }

  private recentError() {
    return throwError(() => {
      new Error('Search error: cannot load recent searches.');
    });
  }

  loadRecent(): void {
    if (!this.store.state.recentLoaded) {
      this.http.post<any>('/api/search/recent', {
        session: localStorage.getItem('state'),
      }).pipe(catchError(this.recentError)).subscribe((data) => {
        this.store.state.recentLoaded = true;
        this.store.state.recentSearches = data;
        this.queryResults = data;
      });
    } else {
      if (this.selectModel.length == 0) {
        this.queryResults = this.store.state.recentSearches;
      }
    }
  }

  _clearRecent: boolean = false;

  clearRecentOpen(): void {
    this._clearRecent = !this._clearRecent;
  }

  clearRecent(): void {
    this.http.post<any>('/api/search/recent_clear', {
      session: localStorage.getItem('state'),
    }).pipe(catchError(this.recentError)).subscribe(() => {
      this.store.state.recentSearches = [];
      this.queryResults = [];
      this.clearRecentOpen();
    });
  }

  hideRecent(pk: string | number): void {
    this.http.post<any>('/api/search/recent_hide', {
      user: pk, session: localStorage.getItem('state'),
    }).pipe(catchError(this.recentError)).subscribe(() => {
      const i = this.store.state.recentSearches.findIndex((res: any) => res.pk == pk);
      this.store.state.recentSearches.splice(i, 1);
      this.queryResults = this.store.state.recentSearches;
    });
  }

  clearValue(): void {
    this.selectModel = '';
    this.isLoading = false;
    this.queryResults = this.store.state.recentSearches;
    this.queryFinished = false;
  }

  loadProfile(user: any): void {
    this.http.post<any>('/api/search/recent_register', {
      id: user.pk, session: localStorage.getItem('state'),
    }).pipe(catchError(this.recentError)).subscribe(() => {
      const i = this.store.state.recentSearches.findIndex((res: any) => res.pk == user.pk);
      if (i >= 0) { this.store.state.recentSearches.splice(i, 1); }
      this.store.state.recentSearches.unshift(user);
      this.router.navigate(['/' + user.username]);
    });
  }
}
