import { Pipe, PipeTransform } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Pipe({ name: 'encode' })

export class EncodePipe implements PipeTransform {

  constructor(private http: HttpClient) { }

  transform(value: string, video = false): Observable<any> {
    return this.http.post<string>('/api/media/encode', { url: value, video: video })
      .pipe(map((data: string) => { return data; }));
  }
}
