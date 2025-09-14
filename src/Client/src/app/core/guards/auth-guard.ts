import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from 'src/app/features/auth/services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth)
  const router = inject(Router);

  const isAuth = authService.isAuthenticated()

  if(isAuth && (state.url === '/auth/login' || state.url === '/auth/register')){
    return router.createUrlTree(['/games'])
  }

  if(isAuth){
    return true
  }

  if(state.url !== '/auth/login' && state.url !== '/auth/register'){
    return router.createUrlTree(['/auth/login'])
  }

  return true
};
