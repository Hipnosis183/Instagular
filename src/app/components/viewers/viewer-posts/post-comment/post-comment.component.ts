import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'post-comment',
  templateUrl: './post-comment.component.html',
  styleUrls: ['./post-comment.component.css']
})

export class PostCommentComponent {

  constructor() { }

  @Input() comment: any;
  @Input() small: boolean = false;
}
