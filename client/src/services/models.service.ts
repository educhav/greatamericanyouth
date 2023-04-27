import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/constants/api';

@Injectable({
  providedIn: 'root'
})
export class ModelsService {
  constructor(private httpClient: HttpClient) { }

  postModel(formData: FormData) {
    const httpOptions: {} = {
      reportProgress: true,
      observe: 'events',
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      })
    };
    return this.httpClient.post(API_URL + 'model', formData, httpOptions);
  }
}
