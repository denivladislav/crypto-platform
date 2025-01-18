import { AfterViewInit, Component, effect, inject, OnInit, ViewChild } from '@angular/core';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { CurrenciesStore, REF_CURRENCIES, RefCurrency, WalletStore } from '../../store';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { SharedModule } from '../../modules';
import { Asset } from '../../services';
import { CustomFilterComponent } from '../../ui';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { CapitalizePipe, UnderscoreToNormalCasePipe } from '../../pipes';

@Component({
    selector: 'app-wallet',
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
    providers: [CurrenciesStore, CurrencyPipe, WalletStore],
    templateUrl: './wallet.component.html',
    styleUrl: './wallet.component.scss',
})
export class WalletComponent implements OnInit, AfterViewInit {
    private _currencyPipe = inject(CurrencyPipe);

    readonly currenciesStore = inject(CurrenciesStore);
    readonly walletStore = inject(WalletStore);

    public refCurrencies = REF_CURRENCIES;
    public currenciesDataColumns = ['name', 'amount', 'price', 'symbol'];
    public dataSource = new MatTableDataSource<Asset>([]);
    public refCurrency?: RefCurrency;

    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator | undefined;
    @ViewChild(MatSort) sort: MatSort | undefined;

    constructor() {
        effect(() => {
            this.refCurrency = this.currenciesStore.refCurrency();
            const assets = this.walletStore.assets();
            const currencies = this.currenciesStore.currencies();
            this.dataSource.data = assets.map((asset) => {
                const currency = currencies.find((currency) => currency.id === asset.id);
                const price = currency?.price || 0;
                return { price: asset.amount * price, ...asset };
            });
        });
    }

    public get isLoading() {
        return this.currenciesStore.isLoading() || this.walletStore.isLoading();
    }

    public applyFilter(value: string) {
        this.dataSource.filter = value.trim().toLowerCase();
    }

    public onRefCurrencyChange({ value }: MatSelectChange) {
        this.currenciesStore.setRefCurrency(value);
        this.currenciesStore.loadCurrenciesByQuery(value);
    }

    public transformValue(column: string, value: string | number): string | null {
        if (column === 'price') {
            return this._currencyPipe.transform(value, this.refCurrency, 'symbol', '1.2-2');
        }

        return String(value);
    }

    public ngOnInit(): void {
        this.walletStore.loadAssetsByQuery('');
        this.currenciesStore.loadCurrenciesByQuery(this.currenciesStore.refCurrency());
    }

    public ngAfterViewInit(): void {
        if (!this.paginator || !this.sort) {
            return;
        }

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }
}
