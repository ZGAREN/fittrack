import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api-config';
import { UserSummary } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class FollowService {
  constructor(private readonly http: HttpClient) {}

  follow(userId: number): Observable<void> {
    return this.http.post<void>(`${API_BASE_URL}/follows/${userId}`, {});
  }

  unfollow(userId: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/follows/${userId}`);
  }

  following(): Observable<UserSummary[]> {
    return this.http.get<UserSummary[]>(`${API_BASE_URL}/follows/following`);
  }

  followers(): Observable<UserSummary[]> {
    return this.http.get<UserSummary[]>(`${API_BASE_URL}/follows/followers`);
  }
}
