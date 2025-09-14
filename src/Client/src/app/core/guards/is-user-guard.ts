import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Storage } from '../services/storage';

export const isUserGuard: CanActivateFn = (route, state) => {
  const storage = inject(Storage)
  const router = inject(Router)

  if(state.url !== `/profile/${storage.get<any>('user').id}`){
    return router.createUrlTree(['/games'])
  }

  return true
};
