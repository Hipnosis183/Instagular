import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { CommentService } from 'src/app/services/comment.service';
import { FriendshipService } from 'src/app/services/friendship.service';
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
    private friendship: FriendshipService,
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

  @Output() onFollow = new EventEmitter();
  @Output() onBesties = new EventEmitter();
  @Output() onFavorite = new EventEmitter();

  followUser(): void {
    this.feedPost.user.friendship_status.following = true;
    this.friendship.follow(this.feedPost.user.pk);
    if (this.store.state.userPage) {
      this.store.state.userPage.friendship.following = true;
    } else { this.onFollow.emit({ id: this.feedPost.user.pk, state: true }); }
  }

  unfollowUser: boolean = false;

  _unfollowUser(): void {
    this.unfollowUser = false;
    this.feedPost.user.friendship_status.following = false;
    this.feedPost.user.friendship_status.is_bestie = false;
    this.feedPost.user.friendship_status.is_feed_favorite = false;
    this.friendship.unfollow(this.feedPost.user.pk);
    if (this.store.state.userPage) {
      this.store.state.userPage.friendship.following = false;
      this.store.state.userPage.friendship.is_bestie = false;
      this.store.state.userPage.friendship.is_feed_favorite = false;
    } else { this.onFollow.emit({ id: this.feedPost.user.pk, state: false }); }
  }

  addBestie(): void {
    this.feedPost.user.friendship_status.is_bestie = true;
    this.friendship.setBesties([this.feedPost.user.pk], []);
    if (this.store.state.userPage) {
      this.store.state.userPage.friendship.is_bestie = true;
    } else { this.onBesties.emit({ id: this.feedPost.user.pk, state: true }); }
  }

  removeBestie(): void {
    this.feedPost.user.friendship_status.is_bestie = false;
    this.friendship.setBesties([], [this.feedPost.user.pk]);
    if (this.store.state.userPage) {
      this.store.state.userPage.friendship.is_bestie = false;
    } else { this.onBesties.emit({ id: this.feedPost.user.pk, state: false }); }
  }

  addFavorite(): void {
    this.feedPost.user.friendship_status.is_feed_favorite = true;
    this.friendship.updateFeedFavorites([this.feedPost.user.pk], []);
    if (this.store.state.userPage) {
      this.store.state.userPage.friendship.is_feed_favorite = true;
    } else { this.onFavorite.emit({ id: this.feedPost.user.pk, state: true }); }
  }

  removeFavorite(): void {
    this.feedPost.user.friendship_status.is_feed_favorite = false;
    this.friendship.updateFeedFavorites([], [this.feedPost.user.pk]);
    if (this.store.state.userPage) {
      this.store.state.userPage.friendship.is_feed_favorite = false;
    } else { this.onFavorite.emit({ id: this.feedPost.user.pk, state: false }); }
  }

  downloadMedia(): void {
    window.open(this.feedPost.instagular.full[this.carouselIndex] + '&se=0&dl=1', '_blank');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['feedPost']) {
      if (!this.feedPost.user.friendship_status) {
        this.feedPost.user.friendship_status = this.store.state.userPage.friendship;
      }
    }
  }
}
