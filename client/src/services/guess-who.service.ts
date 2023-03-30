import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_URL } from 'src/constants/api';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GuessWhoService {

  constructor(private httpClient: HttpClient, private authService: AuthService) { }

  getMessages(quantity: number, length: number, players: string[]) {
    const senders: string = players.join(",");
    const params = new HttpParams().set('senders', senders).set('quantity', quantity).set('length', length).set('token', this.authService.getToken());
    return this.httpClient.get(API_URL + 'messages', { params });
  }
  postScore(username: string, score: number, game: string) {
    return this.httpClient.post(API_URL + 'leaderboards', { username: username, score: score, game: game });
  }
}
