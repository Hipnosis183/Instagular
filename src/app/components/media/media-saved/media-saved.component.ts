import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FeedService } from 'src/app/services/feed.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'media-saved',
  templateUrl: './media-saved.component.html',
  styleUrls: ['./media-saved.component.css']
})

export class MediaSavedComponent {

  constructor(
    private feed: FeedService,
    private location: Location,
    private route: ActivatedRoute,
    private store: StoreService,
    private title: Title,
    private translate: TranslateService,
  ) { }

  feedCollection: any[] = [];
  @Input() feedCollections: any[] = [];

  async loadSavedAll(): Promise<void> {
    await this.feed.savedAll('collection').then((data: any) => {
      this.feedCollection = this.feedCollection.concat(data.posts);
      this.urlUpdate('/all-posts');
    });
  }

  async loadSavedCollection(id: string, reload?: boolean): Promise<void> {
    if (reload) { localStorage.removeItem('collection'); }
    await this.feed.savedCollection(id).then((data: any) => {
      if (reload) { this.feedCollection = []; }
      this.feedCollection = this.feedCollection.concat(data.posts);
      this.urlUpdate('/_/' + id);
    });
  }

  loadedCollection: boolean = false;
  selectedCollection: any = null;
  userPageTitle: string = this.title.getTitle();

  async openCollection(collection: any): Promise<void> {
    this.selectedCollection = collection;
    // Check if the selected collection is general or specific.
    (collection.collection_id == 'ALL_MEDIA_AUTO_COLLECTION')
      ? await this.loadSavedAll()
      : await this.loadSavedCollection(collection.collection_id);
    this.loadedCollection = true;
    this.title.setTitle(collection.collection_name + this.translate.instant('MEDIA_SAVED.SAVED_TITLE'));
  }

  closeCollection(): void {
    this.feedCollection = [];
    this.loadedCollection = false;
    localStorage.removeItem('collection');
    this.title.setTitle(this.userPageTitle);
    this.urlUpdate();
  }

  collectionCreate: boolean = false;

  _collectionCreate(): void {
    // Reload collections.
    this.store.loadSaved();
    this.feedCollections = this.store.state.savedPosts;
    this.collectionCreate = false;
  }

  collectionEdit: boolean = false;

  async _collectionEdit(): Promise<void> {
    // Reload collections.
    this.store.loadSaved();
    this.feedCollections = this.store.state.savedPosts;
    // Update selected collection.
    await this.loadSavedCollection(this.selectedCollection.collection_id, true);
    this.collectionEdit = false;
  }

  collectionDelete: boolean = false;

  _collectionDelete(): void {
    // Reload collections.
    this.store.loadSaved();
    this.feedCollections = this.store.state.savedPosts;
    this.collectionDelete = false;
    this.closeCollection();
  }

  @Output() onUpdate = new EventEmitter();

  urlUpdate(url: string = ''): void {
    this.location.go(this.route.snapshot.paramMap.get('id') + '/saved' + url);
    this.onUpdate.emit(url);
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
          this.title.setTitle(exists.collection_name + this.translate.instant('MEDIA_SAVED.SAVED_TITLE'));
        } else { this.urlUpdate(); }
      } else if (c_name == 'all-posts') {
        await this.loadSavedAll();
        this.selectedCollection = this.feedCollections[0];
        this.loadedCollection = true;
        this.title.setTitle(this.feedCollections[0].collection_name + this.translate.instant('MEDIA_SAVED.SAVED_TITLE'));
      } else { this.urlUpdate(); }
    }
  }

  hideIntersect: boolean = true;
  stopIntersect: boolean = false;
  @Output() onScroll = new EventEmitter();

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
    this.loadUrl();
  }
}
