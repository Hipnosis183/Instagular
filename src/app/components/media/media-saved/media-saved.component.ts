import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { lastValueFrom, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'media-saved',
  templateUrl: './media-saved.component.html',
  styleUrls: ['./media-saved.component.css']
})

export class MediaSavedComponent {

  constructor(
    private http: HttpClient,
    private location: Location,
    private route: ActivatedRoute,
    private store: StoreService,
  ) { }

  feedCollection: any[] = [];
  @Input() feedCollections: any[] = [];

  private savedError() {
    return throwError(() => {
      new Error('Collection error: cannot load user saved collection feed.');
    });
  }

  async loadSavedAll(): Promise<void> {
    await lastValueFrom(
      this.http.post<any>('/api/feed/saved_all', {
        feed: localStorage.getItem('collection'),
        session: localStorage.getItem('state'),
      }).pipe(catchError(this.savedError))).then((data) => {
        localStorage.setItem('collection', data.feed);
        this.feedCollection = this.feedCollection.concat(data.posts);
        this.urlUpdate('/all-posts');
      });
  }

  async loadSavedCollection(id: string, reload?: boolean): Promise<void> {
    if (reload) { localStorage.removeItem('collection'); }
    await lastValueFrom(
      this.http.post<any>('/api/feed/saved_collection', {
        feed: localStorage.getItem('collection'), id: id,
        session: localStorage.getItem('state'),
      }).pipe(catchError(this.savedError))).then((data) => {
        localStorage.setItem('collection', data.feed);
        if (reload) { this.feedCollection = []; }
        this.feedCollection = this.feedCollection.concat(data.posts);
        this.urlUpdate('/_/' + id);
      });
  }

  loadedCollection: boolean = false;
  selectedCollection: any = null;

  async openCollection(collection: any): Promise<void> {
    this.selectedCollection = collection;
    // Check if the selected collection is general or specific.
    (collection.collection_id == 'ALL_MEDIA_AUTO_COLLECTION')
      ? await this.loadSavedAll()
      : await this.loadSavedCollection(collection.collection_id);
    this.loadedCollection = true;
  }

  closeCollection(): void {
    this.feedCollection = [];
    this.loadedCollection = false;
    localStorage.removeItem('collection');
    this.urlUpdate();
  }

  collectionCreate: boolean = false;

  collectionCreateOpen(): void {
    this.collectionCreate = !this.collectionCreate;
  }

  collectionCreated(): void {
    // Reload collections.
    this.store.loadSaved();
    this.feedCollections = this.store.state.savedPosts;
    this.collectionCreate = false;
  }

  collectionEdit: boolean = false;

  collectionEditOpen(): void {
    this.collectionEdit = !this.collectionEdit;
  }

  async collectionEdited(): Promise<void> {
    // Reload collections.
    this.store.loadSaved();
    this.feedCollections = this.store.state.savedPosts;
    // Update selected collection.
    await this.loadSavedCollection(this.selectedCollection.collection_id, true);
    this.collectionEdit = false;
  }

  collectionDelete: boolean = false;

  collectionDeleteOpen(): void {
    this.collectionDelete = !this.collectionDelete;
  }

  collectionDeleted(): void {
    // Reload collections.
    this.store.loadSaved();
    this.feedCollections = this.store.state.savedPosts;
    this.collectionDelete = false;
    this.closeCollection();
  }

  hideIntersect: boolean = true;
  stopIntersect: boolean = false;
  @Output() onScroll = new EventEmitter();

  onIntersection(): void {
    this.hideIntersect = true;
    this.onScroll.emit();
  }

  async loadUrl(): Promise<void> {
    // Load and parse collection name if present.
    let c_name = this.route.snapshot.paramMap.get('c_name');
    if (c_name) {
      // Load and parse collection id if present.
      let c_id = this.route.snapshot.paramMap.get('c_id');
      if (c_id) {
        // Check if the collection from url is valid.
        let exists = await this.feedCollections.find((res) => res.collection_id == c_id);
        if (exists) {
          await this.loadSavedCollection(c_id);
          this.selectedCollection = exists;
          this.loadedCollection = true;
        } else { this.urlUpdate(); }
      } else if (c_name == 'all-posts') {
        await this.loadSavedAll();
        this.selectedCollection = this.feedCollections[0];
        this.loadedCollection = true;
      } else { this.urlUpdate(); }
    }
  }

  @Output() onUpdate = new EventEmitter();

  urlUpdate(url: string = ''): void {
    this.location.go(this.route.snapshot.paramMap.get('id') + '/saved' + url);
    this.onUpdate.emit(url);
  }

  ngOnChanges(): void {
    const feed: any = localStorage.getItem('saved');
    this.hideIntersect = JSON.parse(feed).moreAvailable ? false : true;
    this.stopIntersect = JSON.parse(feed).moreAvailable ? false : true;
  }

  ngOnInit(): void {
    this.loadUrl();
  }
}
