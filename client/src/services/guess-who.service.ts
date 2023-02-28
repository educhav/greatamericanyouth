import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_URL } from 'src/constants/api';
import { GW_SENDERS } from 'src/constants/constants';

@Injectable({
  providedIn: 'root'
})
export class GuessWhoService {

  constructor(private httpClient: HttpClient) { }

  getMessages(quantity: number) {
    const senders: string = GW_SENDERS.join(",");
    const params = new HttpParams().set('senders', senders).set('quantity', quantity);
    return this.httpClient.get(API_URL + 'messages', { params });
  }
  postScore(username: string, score: number) {
    return this.httpClient.post(API_URL + 'leaderboards', { username: username, score: score, game: "guess-who" });
  }
}
