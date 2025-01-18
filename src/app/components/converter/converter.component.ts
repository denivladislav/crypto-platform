import { Component, effect, inject, OnInit } from '@angular/core';
import { CurrenciesStore } from '../../store';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Currency } from '../../services';
import { GetPreciseNumberPipe } from '../../pipes';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { EMPTY, map, Observable, startWith } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export const DEFAULT_CURRENCY_FROM_AMOUNT = 1;

@Component({
    selector: 'app-converter',
    standalone: true,
    imports: [
        CommonModule,
        LoadingSpinnerComponent,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatAutocompleteModule,
        MatIconModule,
        MatButtonModule,
    ],
    providers: [CurrenciesStore, GetPreciseNumberPipe],
    templateUrl: './converter.component.html',
    styleUrl: './converter.component.scss',
})
export class ConverterComponent implements OnInit {
    private _getPreciseNumberPipe = inject(GetPreciseNumberPipe);

    private _resultString: string | null = null;
    private _currencies: Currency[] | null = null;

    public currencyFromOptions$: Observable<string[] | undefined> = EMPTY;
    public currencyToOptions$: Observable<string[] | undefined> = EMPTY;

    readonly store = inject(CurrenciesStore);

    constructor() {
        effect(
            () => {
                this._currencies = this.store.currencies();
                if (this._currencies.length === 0) {
                    return;
                }

                this.converterForm.controls.currencyFromAmount.setValue(DEFAULT_CURRENCY_FROM_AMOUNT);
                this.converterForm.controls.currencyFrom.setValue(this._currencies[0]?.symbol);
                this.converterForm.controls.currencyTo.setValue(this._currencies[1]?.symbol);
                this.onChange();
            },
            { allowSignalWrites: true },
        );
    }

    private _currencyFilter(value: string): string[] {
        if (!this.currencyOptions) {
            return [];
        }

        const filterValue = value.toLowerCase();
        return this.currencyOptions.filter((option) => option.toLowerCase().includes(filterValue));
    }

    public converterForm = new FormGroup<{
        currencyFromAmount: FormControl<number | null>;
        currencyFrom: FormControl<string | null>;
        currencyTo: FormControl<string | null>;
    }>({
        currencyFromAmount: new FormControl(null, [Validators.required, Validators.min(0)]),
        currencyFrom: new FormControl(null, {
            validators: [Validators.required],
        }),
        currencyTo: new FormControl(null, [Validators.required]),
    });

    public get currencyOptions(): string[] | undefined {
        if (!this._currencies) {
            return;
        }

        return this._currencies.map((currency) => currency.symbol);
    }

    public get resultString(): string | null {
        return this._resultString;
    }

    public setResultString(value: number): void {
        this._resultString = `${this.converterForm.value.currencyFromAmount} ${this.converterForm.value.currencyFrom?.toUpperCase()} = ${value} ${this.converterForm.value.currencyTo?.toUpperCase()}`;
    }

    public onChange(): void {
        if (!this._currencies) {
            return;
        }

        const currencyDataFrom = this._currencies.find(
            (currency) => currency.symbol.toLowerCase() === this.converterForm.value.currencyFrom?.toLocaleLowerCase(),
        );
        const currencyDataTo = this._currencies.find(
            (currency) => currency.symbol.toLowerCase() === this.converterForm.value.currencyTo?.toLowerCase(),
        );

        if (!currencyDataFrom) {
            this.converterForm.controls.currencyFrom.setErrors({ notFound: true });
        }

        if (!currencyDataTo) {
            this.converterForm.controls.currencyTo.setErrors({ notFound: true });
        }

        if (!currencyDataFrom || !currencyDataTo || !this.converterForm.value.currencyFromAmount) {
            return;
        }

        const resultAmount = Number(
            (this.converterForm.value.currencyFromAmount * currencyDataFrom.price) / currencyDataTo.price,
        );

        this.setResultString(Number(this._getPreciseNumberPipe.transform(resultAmount)));
    }

    public swapCurrencies() {
        const temp = this.converterForm.controls.currencyFrom.value;
        this.converterForm.controls.currencyFrom.setValue(this.converterForm.controls.currencyTo.value);
        this.converterForm.controls.currencyTo.setValue(temp);
        this.onChange();
    }

    ngOnInit(): void {
        this.store.loadCurrenciesByQuery(this.store.refCurrency());
        this.currencyFromOptions$ = this.converterForm.controls.currencyFrom.valueChanges.pipe(
            startWith(''),
            map((value) => this._currencyFilter(value || '')),
        );
        this.currencyToOptions$ = this.converterForm.controls.currencyTo.valueChanges.pipe(
            startWith(''),
            map((value) => this._currencyFilter(value || '')),
        );
    }
}
