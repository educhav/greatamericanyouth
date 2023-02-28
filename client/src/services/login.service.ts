import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'src/constants/api';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httpClient: HttpClient) { }

  login(username: string, password: string) {
    return this.httpClient.post(API_URL + 'login', { username: username, password: password });
  }

  register(username: string, password: string) {
    return this.httpClient.post(API_URL + 'register', { username: username, password: password });
  }
}
