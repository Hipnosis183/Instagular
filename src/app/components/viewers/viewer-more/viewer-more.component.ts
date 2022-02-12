import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'viewer-more',
  templateUrl: './viewer-more.component.html',
  styleUrls: ['./viewer-more.component.css']
})

export class ViewerMoreComponent implements OnInit {

  constructor() { }

  @Output() closeSend = new EventEmitter();
  @Output() download = new EventEmitter();

  ngOnInit(): void {
  }
}