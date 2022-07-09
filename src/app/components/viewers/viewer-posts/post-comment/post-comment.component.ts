import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommentService } from 'src/app/services/comment.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'post-comment',
  templateUrl: './post-comment.component.html',
  styleUrls: ['./post-comment.component.css']
})

export class PostCommentComponent {

  constructor(
    private _comment: CommentService,
    public store: StoreService,
  ) { }

  @Input() post: any;
  @Input() comment: any;
  @Input() commentSmall: boolean = false;

  @Output() onDelete = new EventEmitter();
  @Output() onReply = new EventEmitter();

  likeComment(): void {
    this.comment = this._comment.like(this.comment);
  }

  unlikeComment(): void {
    this.comment = this._comment.unlike(this.comment);
  }
}
