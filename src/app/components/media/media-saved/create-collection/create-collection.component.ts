import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CollectionService } from 'src/app/services/collection.service';
import { FeedService } from 'src/app/services/feed.service';

@Component({
  selector: 'create-collection',
  templateUrl: './create-collection.component.html',
  styleUrls: ['./create-collection.component.css']
})

export class CreateCollectionComponent {

  constructor(
    private collection: CollectionService,
    private feed: FeedService,
  ) { }

  collectionName: string = '';
  collectionPosts: any[] = [];
  @Input() fromPost: string = '';
  @Output() onCreate = new EventEmitter();

  collectionCreate(): void {
    if (!(this.collectionName.length > 0)) { return; }
    // Add selected posts for the new collection.
    let selectedPosts = [];
    if (this.fromPost.length > 0) {
      selectedPosts.push(this.fromPost);
    } else {
      for (let post of this.collectionPosts) {
        if (post.add) { selectedPosts.push(post.id); }
      }
    }
    // Create new collection.
    this.collection.create(selectedPosts, this.collectionName)
      .then((data) => { this.onCreate.emit(data); });
  }

  collectionGetPosts(more?: boolean): void {
    if (!more) { localStorage.removeItem('collectionCreate'); }
    this.feed.savedAll('collectionCreate').then((data: any) => {
      this.collectionPosts = this.collectionPosts.concat(data.posts);
      this.hideIntersect = JSON.parse(data.feed).moreAvailable ? false : true;
      this.stopIntersect = JSON.parse(data.feed).moreAvailable ? false : true;
    });
  }

  @Output() onClose = new EventEmitter();

  collectionCreateClose(): void {
    localStorage.removeItem('collectionCreate');
    this.onClose.emit();
  }

  hideIntersect: boolean = true;
  stopIntersect: boolean = false;

  onIntersection(): void {
    this.hideIntersect = true;
    this.collectionGetPosts(true);
  }

  ngOnInit(): void {
    if (!this.fromPost) { this.collectionGetPosts(); }
  }
}
