import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'viewer-photo',
  templateUrl: './viewer-photo.component.html',
  styleUrls: ['./viewer-photo.component.css']
})
export class ViewerPhotoComponent implements OnInit {

  constructor() { }

  @Input() feedPost: any;

  @Output() likeSend = new EventEmitter();
  @Output() unlikeSend = new EventEmitter();
  @Output() closeSend = new EventEmitter();

  ngOnInit(): void {
  }
}
