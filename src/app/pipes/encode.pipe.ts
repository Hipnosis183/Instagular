import { Pipe, PipeTransform } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable, map } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Pipe({
  name: 'encode'
})
export class EncodePipe implements PipeTransform {

  constructor(
    private http: HttpClient
  ) { }

  private encodeError(error: HttpErrorResponse) {
    return throwError('Encoding error: wrong url or network error.');
  }

  transform(value: string): Observable<any> {
    return this.http.post<string>('/api/encode', { url: value })
      .pipe(catchError(this.encodeError))
      .pipe(map((data: string) => {
        console.info('Media encoded successfully!');
        return data;
      }));
  }
}
