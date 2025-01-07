import { Component, inject, OnInit } from '@angular/core';
import { CurrenciesStore } from '../../store/currencies.store';

@Component({
    selector: 'app-watchlist',
    standalone: true,
    imports: [],
    providers: [CurrenciesStore],
    templateUrl: './watchlist.component.html',
    styleUrl: './watchlist.component.scss',
})
export class WatchlistComponent implements OnInit {
    readonly store = inject(CurrenciesStore);

    public printAllCurrencies(): void {
        console.log(this.store.currencies());
    }

    public ngOnInit(): void {
        this.store.loadByQuery('');
    }
}
