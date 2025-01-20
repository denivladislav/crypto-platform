import { AfterViewInit, Component, effect, inject, OnInit, ViewChild } from '@angular/core';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { CurrenciesStore, REF_CURRENCIES, RefCurrency, WalletStore } from '../../store';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { SharedModule } from '../../modules';
import { Asset, AssetRaw, Currency, Transaction } from '../../services';
import { CustomFilterComponent } from '../../ui';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { CapitalizePipe, UnderscoreToNormalCasePipe } from '../../pipes';
import {
    FormControl,
    FormGroup,
    FormGroupDirective,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

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
        MatButtonModule,
        MatButtonToggleModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        UnderscoreToNormalCasePipe,
        CapitalizePipe,
        CustomFilterComponent,
    ],
    providers: [CurrencyPipe, WalletStore],
    templateUrl: './wallet.component.html',
    styleUrl: './wallet.component.scss',
})
export class WalletComponent implements OnInit, AfterViewInit {
    private _currencyPipe = inject(CurrencyPipe);

    readonly currenciesStore = inject(CurrenciesStore);
    readonly walletStore = inject(WalletStore);

    public refCurrencies = REF_CURRENCIES;
    public currenciesDataColumns = ['name', 'amount', 'price', 'symbol'];
    public operations = ['buy', 'sell'];
    public currentOperation = this.operations[0];
    public dataSource = new MatTableDataSource<Asset>([]);

    public currencies: Currency[] = [];
    public transactions: Transaction[] = [];
    public assets: Asset[] = [];
    public portfolioSum?: number;
    public refCurrency?: RefCurrency;

    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator | undefined;
    @ViewChild(MatSort) sort: MatSort | undefined;

    constructor() {
        effect(() => {
            this.refCurrency = this.currenciesStore.refCurrency();
            this.transactions = this.walletStore.transactions();
            this.currencies = this.currenciesStore.currencies();
            this.assets = this.walletStore.assets();
            const assetsWithPrice = this.assets.map((asset) => {
                const currency = this.currencies.find((currency) => currency.id === asset.id);
                const price = currency?.price || 0;
                return { price: asset.amount * price, ...asset };
            });
            this.dataSource.data = assetsWithPrice;
            this.portfolioSum = assetsWithPrice.reduce((acc, assetWithPrice) => {
                return (acc += assetWithPrice.price);
            }, 0);
        });
    }

    public transactionPurchaseForm = new FormGroup<{
        amount: FormControl<number | null>;
        currency: FormControl<Currency | null>;
    }>({
        amount: new FormControl(null, [Validators.required, Validators.min(0)]),
        currency: new FormControl(null, [Validators.required]),
    });

    public transactionTradeForm = new FormGroup<{
        amount: FormControl<number | null>;
        asset: FormControl<Asset | null>;
    }>({
        amount: new FormControl(null, [Validators.required, Validators.min(0)]),
        asset: new FormControl(null, [Validators.required]),
    });

    public get isLoading() {
        return this.currenciesStore.isLoading() || this.walletStore.isLoading();
    }

    public setCurrentOperation(value: string) {
        this.currentOperation = value;
    }

    public onOperationChange(value: string) {
        this.setCurrentOperation(value);
    }

    public applyFilter(value: string) {
        this.dataSource.filter = value.trim().toLowerCase();
    }

    public transformValue(column: string, value: string | number): string | null {
        if (column === 'price') {
            return this._currencyPipe.transform(value, this.refCurrency, 'symbol', '1.2-2');
        }

        return String(value);
    }

    public onPurchaseSubmit(formDirective: FormGroupDirective): void {
        const pickedCurrency = this.currencies.find(
            (currency) => currency.symbol === this.transactionPurchaseForm.value.currency?.symbol,
        );

        if (!pickedCurrency || !this.transactionPurchaseForm.value.amount) {
            return;
        }

        const amount = this.transactionPurchaseForm.value.amount;

        if (this.currentOperation === 'buy') {
            if (pickedCurrency.circulating_supply < amount) {
                this.transactionPurchaseForm.controls.amount.setErrors({ amountOverSupply: true });
                return;
            }
        }

        const existingAsset = this.assets.find(
            (asset) => asset.symbol === this.transactionPurchaseForm.value.currency?.symbol,
        );

        let isExistingAsset = false;
        let newAsset: AssetRaw;
        if (existingAsset) {
            newAsset = {
                ...existingAsset,
                amount: existingAsset.amount + amount,
                id: String(existingAsset.id),
            };
            isExistingAsset = true;
        } else {
            newAsset = {
                ...pickedCurrency,
                amount,
                id: String(pickedCurrency.id),
            };
        }

        const newTransactionId = (Math.max(...this.transactions.map((transaction) => transaction.id)) + 1).toString();

        this.walletStore.postTransaction({
            transaction: {
                id: newTransactionId,
                type: 'purchased',
                timestamp: new Date().getTime(),
                asset: {
                    ...pickedCurrency,
                    amount,
                },
            },
            asset: newAsset,
            isExistingAsset,
        });

        formDirective.resetForm();
    }

    public onTradeSubmit(formDirective: FormGroupDirective): void {
        const pickedAsset = this.assets.find((asset) => asset.symbol === this.transactionTradeForm.value.asset?.symbol);

        if (!pickedAsset || !this.transactionTradeForm.value.amount) {
            return;
        }

        const amount = this.transactionTradeForm.value.amount;

        if (this.currentOperation === 'sell') {
            if (pickedAsset.amount < amount) {
                this.transactionTradeForm.controls.amount.setErrors({ amountOverAsset: true });
                return;
            }
        }

        const newAsset = {
            ...pickedAsset,
            amount: pickedAsset.amount - amount,
            id: String(pickedAsset.id),
        };

        this.walletStore.postTransaction({
            transaction: {
                id: String(this.transactions[this.transactions.length - 1].id + 1),
                type: 'traded',
                timestamp: new Date().getTime(),
                asset: {
                    ...pickedAsset,
                    amount,
                },
            },
            asset: newAsset,
            isExistingAsset: true,
        });

        formDirective.resetForm();
    }

    public ngOnInit(): void {
        this.walletStore.loadAssetsAndTransactionsByQuery('');
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
