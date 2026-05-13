import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpMethod } from './backend-config';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);

  request(
    method: HttpMethod,
    baseUrl: string,
    path: string,
    options: {
      authToken?: string;
      body?: unknown;
      query?: Record<string, unknown>;
    } = {}
  ): Observable<unknown> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (options.authToken) {
      headers = headers.set('Authorization', `Bearer ${options.authToken}`);
    }

    let params = new HttpParams();

    if (options.query) {
      Object.entries(options.query).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, String(value));
        }
      });
    }

    return this.http.request(method, `${baseUrl}${path}`, {
      body: options.body,
      headers,
      params
    });
  }
}
