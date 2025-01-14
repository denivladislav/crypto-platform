import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ROUTE_TOKENS } from '../../app.routes';
import { MatButtonModule } from '@angular/material/button';
import { CapitalizePipe } from '../../pipes';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ThemeService } from '../../services';

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        RouterOutlet,
        RouterOutlet,
        MatButtonModule,
        MatSlideToggleModule,
        CapitalizePipe,
    ],
    templateUrl: './landing.component.html',
    styleUrl: './landing.component.scss',
})
export class LandingComponent {
    public routeTokens = Object.values(ROUTE_TOKENS);

    public routes = this.routeTokens.map((route) => ({
        path: route,
    }));

    constructor(
        private _router: Router,
        private _themeService: ThemeService,
    ) {}

    public get currentTab(): string | undefined {
        return this._router.url.split('/').find((path) => (this.routeTokens as string[]).includes(path));
    }

    public getIsRouteSelected(route: string): boolean {
        return this.currentTab === route;
    }

    public get currentTheme(): string {
        return this._themeService.currentTheme;
    }

    public toggleTheme(): void {
        this._themeService.toggleTheme();
    }
}
