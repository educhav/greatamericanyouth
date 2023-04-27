import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/constants/api';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor(private httpClient: HttpClient) { }
  getArticles() {
    return this.httpClient.get(API_URL + 'article');
  }

  getArticleByUrl(urlName: string) {
    const params = new HttpParams().set('urlName', urlName);
    return this.httpClient.get(API_URL + 'article', { params });
  }

  getArticleByUsername(username: string) {
    const params = new HttpParams().set('username', username);
    return this.httpClient.get(API_URL + 'article', { params });
  }

  getArticleMetaData(urlName: string) {
    const params = new HttpParams().set('urlName', urlName);
    return this.httpClient.get(API_URL + 'article-meta', { params });
  }
}
