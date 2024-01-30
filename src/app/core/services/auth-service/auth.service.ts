import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpClient: HttpClient) {}

  login(form: { password: string; email: string }) {
    this.httpClient.post('api/login', form);
  }

  registration(form: { password: string; email: string }) {
    this.httpClient.post('api/login', form);
  }
}
