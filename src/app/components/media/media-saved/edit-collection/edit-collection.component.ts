import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CollectionService } from 'src/app/services/collection.service';
import { FeedService } from 'src/app/services/feed.service';

@Component({
  selector: 'edit-collection',
  templateUrl: './edit-collection.component.html',
  styleUrls: ['./edit-collection.component.css']
})

export class EditCollectionComponent {

  constructor(
    private collection_: CollectionService,
    private feed: FeedService,
  ) { }

  collectionPosts: any[] = [];
  @Input() collection: any;
  @Input() collectionSelected: any;
  @Output() onEdit = new EventEmitter();

  collectionEdit(): void {
    if (!(this.collection.collection_name.length > 0)) { return; }
    // Manage selected posts for the collection.
    let addPosts = [], removePosts = [];
    for (let post of this.collectionPosts) {
      if (post.removeable) {
        if (post.add) { continue; }
        else { removePosts.push(post.id); }
      } if (post.add) { addPosts.push(post.id); }
    }
    // Edit collection with the new information.
    this.collection_.edit(this.collection.collection_id, this.collection.collection_name,
      addPosts, removePosts).then(() => { this.onEdit.emit(); });
  }

  async collectionGetPosts(more?: boolean): Promise<void> {
    if (!more) { localStorage.removeItem('collectionEdit'); }
    this.feed.savedAll('collectionEdit').then((data: any) => {
      for (let post of this.collectionSelected) {
        let k = data.posts.findIndex((res: any) => res.id == post.id);
        if (data.posts[k]) {
          data.posts[k].add = true;
          data.posts[k].removeable = true;
        }
      }
      this.collectionPosts = this.collectionPosts.concat(data.posts);
      this.hideIntersect = JSON.parse(data.feed).moreAvailable ? false : true;
      this.stopIntersect = JSON.parse(data.feed).moreAvailable ? false : true;
    });
  }

  @Output() onClose = new EventEmitter();

  collectionEditClose(): void {
    localStorage.removeItem('collectionEdit');
    this.onClose.emit();
  }

  hideIntersect: boolean = true;
  stopIntersect: boolean = false;

  onIntersection(): void {
    this.hideIntersect = true;
    this.collectionGetPosts(true);
  }

  async ngOnInit(): Promise<void> {
    await this.collectionGetPosts();
  }
}
