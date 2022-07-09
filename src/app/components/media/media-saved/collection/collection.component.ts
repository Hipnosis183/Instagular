import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css']
})

export class CollectionComponent {

  @Input() collection: any;
  @Output() onOpen = new EventEmitter();
}
