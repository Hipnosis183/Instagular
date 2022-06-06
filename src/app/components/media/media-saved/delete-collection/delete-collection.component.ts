import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'delete-collection',
  templateUrl: './delete-collection.component.html',
  styleUrls: ['./delete-collection.component.css']
})

export class DeleteCollectionComponent implements OnInit {

  constructor(private http: HttpClient) { }

  @Output() onDelete = new EventEmitter();
  @Output() onCancel = new EventEmitter();

  @Input() collectionId: string = '';

  private deleteError() {
    return throwError(() => new Error('Collection error: cannot delete collection.'));
  }

  collectionDelete(): void {
    this.http.post<string>('/api/collection/delete', { id: this.collectionId, session: localStorage.getItem('state') })
      .pipe(catchError(this.deleteError))
      .subscribe((data) => {
        console.info('Collection deleted successfully :(');
        this.onDelete.emit();
      });
  }

  collectionDeleteCancel(): void {
    this.onCancel.emit();
  }

  ngOnInit(): void {
  }
}
