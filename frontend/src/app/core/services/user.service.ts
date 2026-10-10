import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api-config';
import { UserSummary } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private readonly http: HttpClient) {}

  me(): Observable<UserSummary> {
    return this.http.get<UserSummary>(`${API_BASE_URL}/users/me`);
  }

  byId(id: number): Observable<UserSummary> {
    return this.http.get<UserSummary>(`${API_BASE_URL}/users/${id}`);
  }
}
