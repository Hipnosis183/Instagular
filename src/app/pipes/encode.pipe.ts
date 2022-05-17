import { Pipe, PipeTransform } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError, Observable, map } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Pipe({
  name: 'encode'
})

export class EncodePipe implements PipeTransform {

  constructor(
    private http: HttpClient
  ) { }

  private encodeError() {
    return throwError(() => new Error('Encoding error: wrong url or network error.'));
  }

  transform(value: string, video = false): Observable<any> {
    return this.http.post<string>('/api/media/encode', { url: value, video: video })
      .pipe(catchError(this.encodeError))
      .pipe(map((data: string) => { return data; }));
  }
}
