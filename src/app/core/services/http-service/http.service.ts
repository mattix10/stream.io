import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

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

  create<T>(url: string, body: T): Observable<T> {
    return this.#httpClient.post<T>(this.createUrl(url), body);
  }

  update<T>(url: string, body: T, id?: string): Observable<T> {
    return this.#httpClient.put<T>(this.createUrl(url, id), body);
  }

  delete(url: string, id: string): Observable<void> {
    return this.#httpClient.delete<void>(this.createUrl(url, id));
  }

  private createUrl(url: string, id?: string): string {
    return environment.API_URL + url + (id ? '/' + id : '');
  }
}
