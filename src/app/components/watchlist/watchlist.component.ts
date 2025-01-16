import { AfterViewInit, Component, effect, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CurrenciesStore, REF_CURRENCIES, RefCurrency } from '../../store';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ShortenNumberPipe, UnderscoreToNormalCasePipe, CapitalizePipe } from '../../pipes';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Currency } from '../../services';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CustomFilterComponent } from '../../ui';
import { SharedModule } from '../../modules';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';

@Component({
    selector: 'app-watchlist',
    standalone: true,
    imports: [
        CommonModule,
        SharedModule,
        LoadingSpinnerComponent,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        UnderscoreToNormalCasePipe,
        CapitalizePipe,
        CustomFilterComponent,
    ],
    providers: [CurrenciesStore, CurrencyPipe, ShortenNumberPipe],
    templateUrl: './watchlist.component.html',
    styleUrl: './watchlist.component.scss',
})
export class WatchlistComponent implements OnInit, AfterViewInit, OnDestroy {
    private _currencyPipe = inject(CurrencyPipe);
    private _shortenNumberPipe = inject(ShortenNumberPipe);
    private _intervalId: ReturnType<typeof setInterval> | undefined;
    private _updateTime = 120000;

    readonly store = inject(CurrenciesStore);

    public refCurrencies = REF_CURRENCIES;
    public currenciesDataColumns = ['name', 'symbol', 'price', 'circulating_supply', 'market_cap'];
    public dataSource = new MatTableDataSource<Currency>([]);
    public refCurrency?: RefCurrency;

    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator | undefined;
    @ViewChild(MatSort) sort: MatSort | undefined;

    constructor() {
        effect(() => {
            this.refCurrency = this.store.refCurrency();
            this.dataSource.data = this.store.currencies();
        });
    }

    public onRefCurrencyChange({ value }: MatSelectChange) {
        this.store.setRefCurrency(value);
        this.store.loadByQuery(value);
    }

    public transformValue(column: string, value: string | number): string | null {
        if (column === 'price') {
            return this._currencyPipe.transform(value, this.refCurrency, 'symbol', '1.2-2');
        }
        if (column === 'market_cap') {
            const shortenedNumberString = this._shortenNumberPipe.transform(value as number);
            const shortenedNumber = Number(shortenedNumberString.slice(0, -1));
            const shortener = shortenedNumberString.slice(-1);
            return `${this._currencyPipe.transform(shortenedNumber, this.refCurrency, 'symbol', '1.2-2')}${shortener}`;
        }
        if (column === 'circulating_supply') {
            return this._shortenNumberPipe.transform(value as number);
        }

        return String(value);
    }

    public applyFilter(value: string) {
        this.dataSource.filter = value.trim().toLowerCase();
    }

    public ngOnInit(): void {
        this.store.loadByQuery(this.store.refCurrency);
        this._intervalId = setInterval(() => {
            this.store.loadByQuery(this.store.refCurrency);
        }, this._updateTime);

        this.dataSource.filterPredicate = (data: Currency, filter: string) => {
            return data.name.toLowerCase().includes(filter) || data.symbol.toLowerCase().includes(filter);
        };
    }

    public ngAfterViewInit(): void {
        if (!this.paginator || !this.sort) {
            return;
        }

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    public ngOnDestroy(): void {
        clearInterval(this._intervalId);
    }
}
