import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommentService } from 'src/app/services/comment.service';
import { MediaService } from 'src/app/services/media.service';
import { StoreService } from 'src/app/services/store.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'post-panel',
  templateUrl: './post-panel.component.html',
  styleUrls: ['./post-panel.component.css']
})

export class PostPanelComponent {

  constructor(
    private comment: CommentService,
    private media: MediaService,
    public store: StoreService,
    private user: UserService,
  ) { }

  @Input() feedPost: any;
  @Input() feedIndex: any;
  @Input() carouselIndex: number = 0;

  likeMedia(post: any): void {
    this.feedPost = this.media.like(post);
  }

  unlikeMedia(post: any): void {
    this.feedPost = this.media.unlike(post);
  }

  saveMedia(post: any): void {
    this.feedPost = this.media.save(post);
  }

  unsaveMedia(post: any): void {
    this.feedPost = this.media.unsave(post);
  }

  saveCollection(post: any, collection: any): void {
    if (post.saved_collection_ids) {
      if (!post.saved_collection_ids.includes(collection.collection_id)) {
        this.feedPost = this.media.save(post, collection.collection_id);
      } else { this.feedPost = this.media.unsave(post, collection.collection_id); }
    } else { this.feedPost = this.media.save(post, collection.collection_id); }
  }

  collectionCreate: boolean = false;

  _collectionCreate(collection: any): void {
    // Reload collections.
    this.store.loadSaved();
    this.collectionCreate = false;
    // Update post element.
    this.feedPost.has_viewer_saved = true;
    this.feedPost.saved_collection_ids = [collection.collection_id];
  }

  postPin: boolean = false;
  @Output() onPin = new EventEmitter();
  @Output() onUnpin = new EventEmitter();

  _postPin(): void {
    if (this.feedIndex.pin && !this.postPin) {
      this.postPin = true; return;
    } else { this.postPin = false; }
    this.onPin.emit(this.feedIndex.current);
    this.feedPost = this.user.postPin(this.feedPost);
  }

  postUnpin(): void {
    this.onUnpin.emit(this.feedIndex.current);
    this.feedPost = this.user.postUnpin(this.feedPost);
  }

  likesHide(): void {
    this.feedPost = this.media.likesHide(this.feedPost);
  }

  likesUnhide(): void {
    this.feedPost = this.media.likesUnhide(this.feedPost);
  }

  commentsEnable(): void {
    this.feedPost = this.comment.commentsEnable(this.feedPost);
  }

  commentsDisable(): void {
    this.feedPost = this.comment.commentsDisable(this.feedPost);
  }

  downloadMedia(): void {
    window.open(this.feedPost.instagular.full[this.carouselIndex] + '&se=0&dl=1', '_blank');
  }
}
