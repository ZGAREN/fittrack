import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api-config';
import { Activity, ActivityCreateRequest } from '../models/activity.model';

@Injectable({ providedIn: 'root' })
export class ActivityService {
  constructor(private readonly http: HttpClient) {}

  create(request: ActivityCreateRequest): Observable<Activity> {
    return this.http.post<Activity>(`${API_BASE_URL}/activities`, request);
  }

  getMine(): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${API_BASE_URL}/activities/me`);
  }

  getFeed(): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${API_BASE_URL}/activities/feed`);
  }

  getById(id: number): Observable<Activity> {
    return this.http.get<Activity>(`${API_BASE_URL}/activities/${id}`);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/activities/${id}`);
  }
}
