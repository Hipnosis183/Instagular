import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'media-saved',
  templateUrl: './media-saved.component.html',
  styleUrls: ['./media-saved.component.css']
})

export class MediaSavedComponent implements OnInit {

  constructor(
    private http: HttpClient
  ) { }

  @Input() feedCollections: any[] = [];
  @Output() onScroll = new EventEmitter();

  feedCollection: any[] = [];

  private savedError() {
    return throwError(() => new Error('Collection error: cannot load user saved collection feed.'));
  }

  async loadSavedAll(): Promise<void> {
    await lastValueFrom(
      this.http.post<any>('/api/feed/saved_all', { feed: localStorage.getItem('collection'), session: localStorage.getItem('state') })
        .pipe(catchError(this.savedError))).then((data: any) => {
          console.info('All user saved posts loaded successfully!');
          localStorage.setItem('collection', data.feed);
          this.feedCollection = this.feedCollection.concat(data.posts);
        });
  }

  async loadSavedCollection(id: string): Promise<void> {
    await lastValueFrom(
      this.http.post<any>('/api/feed/saved_collection', { feed: localStorage.getItem('collection'), id: id, session: localStorage.getItem('state') })
        .pipe(catchError(this.savedError))).then((data: any) => {
          console.info('User collection posts loaded successfully!');
          localStorage.setItem('collection', data.feed);
          this.feedCollection = this.feedCollection.concat(data.posts);
        });
  }

  selectedCollection: string = '';

  async openCollection(id: any): Promise<void> {
    this.selectedCollection = id;
    // Check if the selected collection is general or specific.
    (id == 'ALL_MEDIA_AUTO_COLLECTION') ? await this.loadSavedAll() : await this.loadSavedCollection(id);
  }

  closeCollection(): void {
    this.feedCollection = [];
    localStorage.removeItem('collection');
  }

  hideIntersect: boolean = true;
  stopIntersect: boolean = false;

  onIntersection(): void {
    this.hideIntersect = true;
    this.onScroll.emit();
  }

  ngOnChanges(): void {
    const feed: any = localStorage.getItem('saved');
    this.hideIntersect = JSON.parse(feed).moreAvailable ? false : true;
    this.stopIntersect = JSON.parse(feed).moreAvailable ? false : true;
  }

  ngOnInit(): void {
  }
}
