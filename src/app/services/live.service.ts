import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class LiveService {

  constructor(private http: HttpClient) { }

  async setSubscriptionPreference(id: any, option: string): Promise<any> {
    return await lastValueFrom(
      this.http.post('/api/live/set_subscription_preference', {
        id: id, option: option, session: localStorage.getItem('state'),
      })).then((data) => { return data; });
  }
}
