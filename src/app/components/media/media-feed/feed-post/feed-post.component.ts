import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MediaService } from 'src/app/services/media.service';

@Component({
  selector: 'feed-post',
  templateUrl: './feed-post.component.html',
  styleUrls: ['./feed-post.component.css']
})

export class FeedPostComponent {

  constructor(private media: MediaService) { }

  @Input() post: any;
  @Input() hideHeader: boolean = false;
  @Output() onOpen = new EventEmitter();

  likeMedia(post: any): void {
    this.post = this.media.like(post);
  }

  unlikeMedia(post: any): void {
    this.post = this.media.unlike(post);
  }
}
