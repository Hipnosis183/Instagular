import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'media-feed',
  templateUrl: './media-feed.component.html',
  styleUrls: ['./media-feed.component.css']
})

export class MediaFeedComponent {

  feedIndex: any = { current: null, total: null };
  feedPost: any = null;
  @Input() feedPosts: any[] = [];
  @Input() feedSaved: boolean = false;
  @Input() hideHeader: boolean = false;
  @Output() onUpdate = new EventEmitter;

  openMedia(post: any): void {
    this.feedPost = post;
    this.feedIndex.current = this.feedPosts.findIndex((res) => res.id == post.id);
    this.feedIndex.total = this.feedPosts.length - 1;
    this.pinStateUpdate();
  }

  prevPost(): void {
    this.feedIndex.current--;
    this.feedPost = this.feedPosts[this.feedIndex.current];
  }

  nextPost(): void {
    this.feedIndex.current++;
    this.feedPost = this.feedPosts[this.feedIndex.current];
  }

  pinStateUpdate(): void {
    // Indicate if pin slots are full.
    if (this.feedPosts.length > 2) {
      this.feedIndex.pin = this.feedPosts[2].timeline_pinned_user_ids ? true : false;
    }
  }

  pinUpdate(index: number): void {
    this.feedPosts.unshift(this.feedPosts.splice(index, 1)[0]);
    if (this.feedIndex.pin) {
      this.feedPosts[3].timeline_pinned_user_ids = null;
      let k = this.feedPosts.length;
      for (let i = 4; i < this.feedPosts.length; i++) {
        if (this.feedPosts[3].taken_at > this.feedPosts[i].taken_at) {
          k = i - 1; break;
        }
      }
      const post = this.feedPosts.splice(3, 1)[0];
      if (k == this.feedPosts.length) {
        if (this.stopIntersect) {
          this.feedPosts.splice(k, 0, post);
        }
      } else { this.feedPosts.splice(k, 0, post); }
    } this.pinStateUpdate();
  }

  unpinUpdate(index: number): void {
    this.feedPosts[index].timeline_pinned_user_ids = null;
    let k = this.feedPosts.length;
    for (let i = index + 1; i < this.feedPosts.length; i++) {
      if ((this.feedPosts[index].taken_at > this.feedPosts[i].taken_at)
        && !this.feedPosts[i].timeline_pinned_user_ids) {
        k = i - 1; break;
      }
    }
    const post = this.feedPosts.splice(index, 1)[0];
    if (k == this.feedPosts.length) {
      if (this.stopIntersect) {
        this.feedPosts.splice(k, 0, post);
      }
    } else { this.feedPosts.splice(k, 0, post); }
    this.pinStateUpdate();
  }

  followUpdate(user: { id: number, state: boolean }): void {
    let is_private = this.feedPosts.find((v) => v.user.pk == user.id).user.is_private;
    if (!is_private) {
      for (let i = 0; i < this.feedPosts.length; i++) {
        if (this.feedPosts[i].user.pk == user.id) {
          this.feedPosts[i].user.friendship_status.following = user.state;
        }
      }
    } else { this.onUpdate.emit(user.id); }
  }

  bestiesUpdate(user: { id: number, state: boolean }): void {
    for (let i = 0; i < this.feedPosts.length; i++) {
      if (this.feedPosts[i].user.pk == user.id) {
        this.feedPosts[i].user.friendship_status.is_bestie = user.state;
      }
    }
  }

  favoriteUpdate(user: { id: number, state: boolean }): void {
    for (let i = 0; i < this.feedPosts.length; i++) {
      if (this.feedPosts[i].user.pk == user.id) {
        this.feedPosts[i].user.friendship_status.is_feed_favorite = user.state;
      }
    }
  }

  blockUpdate(user: { id: number, state: boolean }): void {
    this.onUpdate.emit(user.id);
  }

  hideIntersect: boolean = true;
  stopIntersect: boolean = false;
  @Output() onScroll = new EventEmitter();

  onIntersection(): void {
    this.hideIntersect = true;
    this.onScroll.emit();
  }

  @Input() feedStorage: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (this.feedStorage.length > 0) {
      const feed: any = localStorage.getItem(this.feedStorage);
      this.hideIntersect = JSON.parse(feed).moreAvailable ? false : true;
      this.stopIntersect = JSON.parse(feed).moreAvailable ? false : true;
    }
    else if (!changes['feedPosts'].firstChange) {
      const feed: any = localStorage.getItem('feed');
      this.hideIntersect = JSON.parse(feed).moreAvailable ? false : true;
      this.stopIntersect = JSON.parse(feed).moreAvailable ? false : true;
    }
  }
}
