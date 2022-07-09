import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class SearchService {

  constructor(private http: HttpClient) { }

  async recent(): Promise<any> {
    return await lastValueFrom(
      this.http.post('/api/search/recent', {
        session: localStorage.getItem('state'),
      })).then((data) => { return data; });
  }

  recentClear(): void {
    this.http.post('/api/search/recent_clear', {
      session: localStorage.getItem('state'),
    }).subscribe();
  }

  recentHide(user: any): void {
    this.http.post('/api/search/recent_hide', {
      user: user, session: localStorage.getItem('state'),
    }).subscribe();
  }

  recentRegister(id: string): void {
    this.http.post('/api/search/recent_register', {
      id: id, session: localStorage.getItem('state'),
    }).subscribe();
  }

  async users(query: string): Promise<any> {
    return await lastValueFrom(
      this.http.post('/api/search/users', {
        query: query, session: localStorage.getItem('state'),
      })).then((data) => { return data; });
  }
}
