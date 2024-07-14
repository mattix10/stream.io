import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { UpdateUserStatusRequest } from '../models/requests/update-user-status-request';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  readonly #httpClient = inject(HttpClient);

  getItems<T>(url: string, params?: HttpParams): Observable<T> {
    return this.#httpClient.get<T>(this.createUrl(url), { params });
  }

  getItem<T>(url: string, id?: string): Observable<T> {
    return this.#httpClient.get<T>(this.createUrl(url, id));
  }

  create<T, K>(url: string, body: K): Observable<T> {
    return this.#httpClient.post<T>(this.createUrl(url), body);
  }

  update<T>(url: string, body: T, id?: string): Observable<T> {
    return this.#httpClient.put<T>(this.createUrl(url, id), body);
  }

  updateEntity<T>(url: string, body: T, id?: string): Observable<T> {
    return this.#httpClient.patch<T>(this.createUrl(url, id), body);
  }

  updateStatus(url: string, body: UpdateUserStatusRequest): Observable<void> {
    return this.#httpClient.patch<void>(this.createUrl(url), body);
  }

  delete(url: string, id?: string, body?: any): Observable<void> {
    console.log(body);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.#httpClient.delete<void>(this.createUrl(url, id), {
      ...httpOptions,
      body: JSON.stringify({ password: body }),
    });
  }

  private createUrl(url: string, id?: string): string {
    return environment.API_URL + url + (id ? '/' + id : '');
  }
}
