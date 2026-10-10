import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { Shell } from './layout/shell';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register').then((m) => m.Register)
  },
  {
    path: '',
    component: Shell,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'record' },
      {
        path: 'record',
        loadComponent: () => import('./features/record/record').then((m) => m.Record)
      },
      {
        path: 'history',
        loadComponent: () => import('./features/history/history').then((m) => m.History)
      },
      {
        path: 'activity/:id',
        loadComponent: () => import('./features/activity-detail/activity-detail').then((m) => m.ActivityDetail)
      },
      {
        path: 'feed',
        loadComponent: () => import('./features/feed/feed').then((m) => m.Feed)
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile').then((m) => m.Profile)
      }
    ]
  },
  { path: '**', redirectTo: 'record' }
];
