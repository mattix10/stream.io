import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class LicenseService {
  constructor(private http: HttpClient) {}

  getLicense(message: ArrayBuffer): Observable<LicenseResponse> {
    return this.http.post<LicenseResponse>(`${environment.API_URL}`, message, { responseType: 'json' });
  }
}

export interface LicenseResponse {
  key: number[];
  iv: number[];
}
