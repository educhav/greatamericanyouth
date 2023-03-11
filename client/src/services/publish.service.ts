import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/constants/api';

@Injectable({
  providedIn: 'root'
})
export class PublishService {

  constructor(private httpClient: HttpClient) { }

  publishArticle(formData: FormData) {
    const httpOptions: {} = {
      reportProgress: true,
      observe: 'events',
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('token')}`

      })
    };
    return this.httpClient.post(API_URL + 'article', formData, httpOptions);
  }
}
