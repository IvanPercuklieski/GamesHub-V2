export const PROFILE_ROUTES = [
    {
        path: ':id',
        loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent)
    }
]