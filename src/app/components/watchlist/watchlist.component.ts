import { AfterViewInit, Component, effect, inject, OnInit, ViewChild } from '@angular/core';
import { CurrenciesStore } from '../../store/currencies-store';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CurrenciesPreparedDatum } from '../../services/currencies-service/currencies.types';
import { ShortenNumberPipe } from '../../pipes/shorten-number';
import { CapitalizePipe } from '../../pipes/capitalize';
import { UnderscoreToNormalCasePipe } from '../../pipes/underscore-to-normal-case';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
    selector: 'app-watchlist',
    standalone: true,
    imports: [
        CommonModule,
        LoadingSpinnerComponent,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        UnderscoreToNormalCasePipe,
        CapitalizePipe,
    ],
    providers: [CurrenciesStore, CurrencyPipe, ShortenNumberPipe],
    templateUrl: './watchlist.component.html',
    styleUrl: './watchlist.component.scss',
})
export class WatchlistComponent implements OnInit, AfterViewInit {
    private _currencyPipe = inject(CurrencyPipe);
    private _shortenNumberPipe = inject(ShortenNumberPipe);
    readonly store = inject(CurrenciesStore);
    public currenciesDataColumns = ['name', 'symbol', 'price', 'circulating_supply', 'market_cap'];
    public dataSource = new MatTableDataSource<CurrenciesPreparedDatum>([]);

    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator | undefined;
    @ViewChild(MatSort) sort: MatSort | undefined;

    constructor() {
        effect(() => {
            this.dataSource.data = this.store.currencies().map((currency) => ({
                ...currency,
                price: currency.quote['USD'].price,
                market_cap: currency.quote['USD'].market_cap,
            }));
        });
    }

    public transformValue(column: string, value: string | number) {
        switch (column) {
            case 'price':
                return this._currencyPipe.transform(value, 'USD', 'symbol', '1.2-2');
            case 'circulating_supply':
            case 'market_cap':
                return this._shortenNumberPipe.transform(value as number);
            default:
                return value;
        }
    }

    public ngOnInit(): void {
        this.store.loadByQuery('');
    }

    public ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator!;
        this.dataSource.sort = this.sort!;
    }
}
