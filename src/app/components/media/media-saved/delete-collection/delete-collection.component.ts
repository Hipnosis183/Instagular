import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CollectionService } from 'src/app/services/collection.service';

@Component({
  selector: 'delete-collection',
  templateUrl: './delete-collection.component.html',
  styleUrls: ['./delete-collection.component.css']
})

export class DeleteCollectionComponent {

  constructor(private collection: CollectionService) { }

  @Input() collectionId: string = '';
  @Output() onCancel = new EventEmitter();
  @Output() onDelete = new EventEmitter();

  collectionDelete(): void {
    this.collection.delete(this.collectionId)
      .then(() => { this.onDelete.emit(); });
  }
}
