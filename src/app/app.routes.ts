import { Routes } from '@angular/router';

export const ROUTE_TOKENS = {
    WATCHLIST: 'watchlist',
    CONVERTER: 'converter',
} as const;

export const routes: Routes = [
    {
        path: '',
        redirectTo: ROUTE_TOKENS.WATCHLIST,
        pathMatch: 'full',
    },
    {
        path: ROUTE_TOKENS.WATCHLIST,
        loadComponent: () => import('./components/landing/landing.component').then((c) => c.LandingComponent),
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('./components/watchlist/watchlist.component').then((c) => c.WatchlistComponent),
            },
        ],
    },
    {
        path: ROUTE_TOKENS.CONVERTER,
        loadComponent: () => import('./components/landing/landing.component').then((c) => c.LandingComponent),
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('./components/converter/converter.component').then((c) => c.ConverterComponent),
            },
        ],
    },
    {
        path: '**',
        redirectTo: '/',
    },
];
