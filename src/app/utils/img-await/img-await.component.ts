import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'img-await',
  templateUrl: './img-await.component.html',
  styleUrls: ['./img-await.component.css']
})

export class ImgAwaitComponent implements OnInit {

  constructor() { }

  display = 0;

  _source: any;
  @Input()
  set source(value: any) {
    this._source = value;
    this.display = 0;
  }
  get source(): string {
    return this._source;
  }

  loaded(): void {
    this.display = 1;
  }

  ngOnInit(): void {
  }
}
