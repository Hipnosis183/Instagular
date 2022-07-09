import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class CollectionService {

  constructor(private http: HttpClient) { }

  async create(medias: any[], name: string): Promise<any> {
    return await lastValueFrom(
      this.http.post('/api/collection/create', {
        medias: medias, name: name,
        session: localStorage.getItem('state'),
      })).then((data) => {
        localStorage.removeItem('collectionCreate');
        return data;
      });
  }

  async edit(id: any, name: string, add: any[], remove: any[]): Promise<void> {
    return await lastValueFrom(
      this.http.post('/api/collection/edit', {
        id: id, name: name, add: add, remove: remove,
        session: localStorage.getItem('state'),
      })).then(() => {
        localStorage.removeItem('collectionEdit');
      });
  }

  async delete(id: string): Promise<void> {
    return await lastValueFrom(
      this.http.post<void>('/api/collection/delete', {
        id: id, session: localStorage.getItem('state'),
      }));
  }
}
