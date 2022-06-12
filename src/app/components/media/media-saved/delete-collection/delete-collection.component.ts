import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'delete-collection',
  templateUrl: './delete-collection.component.html',
  styleUrls: ['./delete-collection.component.css']
})

export class DeleteCollectionComponent {

  constructor(private http: HttpClient) { }

  @Input() collectionId: string = '';
  @Output() onDelete = new EventEmitter();

  private deleteError() {
    return throwError(() => {
      new Error('Collection error: cannot delete collection.');
    });
  }

  collectionDelete(): void {
    this.http.post<string>('/api/collection/delete', {
      id: this.collectionId,
      session: localStorage.getItem('state'),
    }).pipe(catchError(this.deleteError)).subscribe(() => {
      this.onDelete.emit();
    });
  }

  @Output() onCancel = new EventEmitter();

  collectionDeleteCancel(): void {
    this.onCancel.emit();
  }
}
