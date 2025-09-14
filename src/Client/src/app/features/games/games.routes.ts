export const GAMES_ROUTES = [
    {
        path: '',
        loadComponent: () => import('./components/games-page/games-page.component').then(m => m.GamesPageComponent)
    },
    {
        path: 'upload',
        loadComponent: () => import('./components/games-form/games-form.component').then(m => m.GamesFormComponent)
    },
    {
        path: ':id/play',
        loadComponent: () => import('./components/play-game/play-game.component').then(m => m.PlayGameComponent)
    },
    {
        path: 'browse',
        loadComponent: () => import('./components/browse-games/browse-games.component').then(m => m.BrowseGamesComponent)
    }
]