import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ROUTE_TOKENS } from '../../app.routes';
import { MatButtonModule } from '@angular/material/button';
import { CapitalizePipe } from '../../pipes';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ThemeService } from '../../services';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { CurrenciesStore, REF_CURRENCIES, RefCurrency } from '../../store';

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        RouterOutlet,
        RouterOutlet,
        MatButtonModule,
        MatSelectModule,
        MatSlideToggleModule,
        CapitalizePipe,
    ],
    templateUrl: './landing.component.html',
    styleUrl: './landing.component.scss',
})
export class LandingComponent {
    readonly currenciesStore = inject(CurrenciesStore);

    public routeTokens = Object.values(ROUTE_TOKENS);
    public routes = this.routeTokens.map((route) => ({
        path: route,
    }));
    public refCurrencies = REF_CURRENCIES;
    public refCurrency?: RefCurrency;

    constructor(
        private _router: Router,
        private _themeService: ThemeService,
    ) {
        effect(() => {
            this.refCurrency = this.currenciesStore.refCurrency();
        });
    }

    public get currentTab(): string | undefined {
        return this._router.url.split('/').find((path) => (this.routeTokens as string[]).includes(path));
    }

    public getIsRouteSelected(route: string): boolean {
        return this.currentTab === route;
    }

    public get currentTheme(): string {
        return this._themeService.currentTheme;
    }

    public onRefCurrencyChange({ value }: MatSelectChange) {
        this.currenciesStore.setRefCurrency(value);
        this.currenciesStore.loadCurrenciesByQuery(value);
    }

    public toggleTheme(): void {
        this._themeService.toggleTheme();
    }
}
