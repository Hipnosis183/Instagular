import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'media-saved',
  templateUrl: './media-saved.component.html',
  styleUrls: ['./media-saved.component.css']
})

export class MediaSavedComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private store: StoreService
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

  async loadSavedCollection(id: string, reload?: boolean): Promise<void> {
    if (reload) { localStorage.removeItem('collection'); }
    await lastValueFrom(
      this.http.post<any>('/api/feed/saved_collection', { feed: localStorage.getItem('collection'), id: id, session: localStorage.getItem('state') })
        .pipe(catchError(this.savedError))).then((data: any) => {
          console.info('User collection posts loaded successfully!');
          localStorage.setItem('collection', data.feed);
          if (reload) { this.feedCollection = []; }
          this.feedCollection = this.feedCollection.concat(data.posts);
        });
  }

  selectedCollection: any;

  async openCollection(collection: any): Promise<void> {
    this.selectedCollection = collection;
    // Check if the selected collection is general or specific.
    (collection.collection_id == 'ALL_MEDIA_AUTO_COLLECTION') ? await this.loadSavedAll() : await this.loadSavedCollection(collection.collection_id);
  }

  closeCollection(): void {
    this.feedCollection = [];
    localStorage.removeItem('collection');
  }

  collectionCreate: boolean = false;

  collectionCreateOpen(): void {
    this.collectionCreate = !this.collectionCreate;
  }

  collectionsUpdate(): void {
    // Reload collections.
    this.store.loadSaved();
    this.feedCollections = this.store.state.savedPosts;
    this.collectionCreate = false;
  }

  collectionEdit: boolean = false;

  collectionEditOpen(): void {
    this.collectionEdit = !this.collectionEdit;
  }

  async collectionUpdate(): Promise<void> {
    // Reload collections.
    this.store.loadSaved();
    this.feedCollections = this.store.state.savedPosts;
    // Update selected collection.
    await this.loadSavedCollection(this.selectedCollection.collection_id, true);
    this.collectionEdit = false;
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
