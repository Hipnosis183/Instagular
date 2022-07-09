import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DelayService } from 'src/app/services/delay.service';
import { SearchService } from 'src/app/services/search.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.css']
})

export class SearchBoxComponent {

  constructor(
    private delay: DelayService,
    private router: Router,
    private search: SearchService,
    public store: StoreService,
  ) { }

  loadedSearch = true;
  queryResults: any[] = [];
  queryFinished: boolean = true;
  searchRecent: any[] = this.store.state.recentSearches;

  @Input() selectModel: string = '';
  @Output() onClear = new EventEmitter();
  @Output() onClearAll = new EventEmitter();

  _updateValue() {
    this.loadedSearch = false;
    this.updateValueDebounced();
  }
  updateValueDebounced = this.delay.debounce(() => this.updateValue(), 2000);
  updateValue(): void {
    if (this.selectModel && this.selectModel.length > 0) {
      this.search.users(this.selectModel).then((data) => {
        this.queryResults = data;
        this.queryFinished = true;
        this.loadedSearch = true;
      });
    } else {
      this.queryResults = this.store.state.recentSearches;
      this.loadedSearch = true;
    }
  }

  loadRecent(): void {
    if (!this.store.state.recentLoaded) {
      this.store.state.recentLoaded = true;
      this.search.recent().then((data) => {
        this.store.state.recentSearches = data;
        this.queryResults = data;
      });
    } else {
      if (this.selectModel.length == 0) {
        this.queryResults = this.store.state.recentSearches;
      }
    }
  }

  _clearRecent(): void {
    this.store.state.recentSearches = [];
    this.queryResults = [];
    this.onClearAll.emit();
    this.search.recentClear();
  }

  hideRecent(pk: string | number): void {
    const i = this.store.state.recentSearches.findIndex((res: any) => res.pk == pk);
    this.store.state.recentSearches.splice(i, 1);
    this.queryResults = this.store.state.recentSearches;
    this.search.recentHide(pk);
  }

  clearValue(): void {
    this.onClear.emit();
    this.loadedSearch = true;
    this.queryResults = this.store.state.recentSearches;
    this.queryFinished = false;
  }

  loadProfile(user: any): void {
    this.search.recentRegister(user.pk);
    const i = this.store.state.recentSearches.findIndex((res: any) => res.pk == user.pk);
    if (i >= 0) { this.store.state.recentSearches.splice(i, 1); }
    this.store.state.recentSearches.unshift(user);
    this.router.navigate(['/' + user.username]);
  }
}
