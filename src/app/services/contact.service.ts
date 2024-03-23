import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IContactDetail } from '../models/contact-detail.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private readonly apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) { }

  getUser(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  getUsers(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  postUsers(data: IContactDetail) {
    return this.http.post(this.apiUrl, data);
  }

  deleteUsers(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  UpdateUsers(id: any, data: any) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }
}
