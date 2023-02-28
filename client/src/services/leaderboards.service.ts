import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/constants/api';
import { GAMES, GW_SENDERS } from 'src/constants/constants';

@Injectable({
  providedIn: 'root'
})
export class LeaderboardsService {

  constructor(private httpClient: HttpClient) { }

  getLeaderboards() {
    const games: string = GAMES.join(",");
    const params = new HttpParams().set('games', games);
    return this.httpClient.get(API_URL + 'leaderboards', { params });
  }
}
