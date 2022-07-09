import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class HighlightsService {

  constructor(private http: HttpClient) { }

  async tray(id: string): Promise<any> {
    return await lastValueFrom(
      this.http.post('/api/highlights/tray', {
        id: id, session: localStorage.getItem('state'),
      })).then((data) => { return data; });
  }
}
