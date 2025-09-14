import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { isUserGuard } from './core/guards/is-user-guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
    canActivate: [authGuard]
  },
  {
    path: 'games',
    loadChildren: () => import('./features/games/games.routes').then(m => m.GAMES_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    loadChildren: () => import('./features/profile/profile.routes').then(m => m.PROFILE_ROUTES),
    canActivate: [authGuard, isUserGuard]
  },
  {
    path: '',
    redirectTo: 'games',
    pathMatch: 'full',
  },
];
