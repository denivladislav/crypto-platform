import { HttpClient } from '@angular/common/http';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Currency, CurrencyRaw, GenericResponse } from './currencies.types';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RefCurrency } from '../../store';

const LIMIT = 50;

@Injectable({
    providedIn: 'root',
})
export class CurrenciesService {
    private _http = inject(HttpClient);
    private _destroyRef = inject(DestroyRef);
    private _apiKey = environment.API_KEY;
    private _currenciesBaseUrl = '/currenciesApi';

    getCurrencies(refCurrency: RefCurrency): Observable<Currency[]> {
        return this._http
            .get<GenericResponse<CurrencyRaw[]>>(`${this._currenciesBaseUrl}/v1/cryptocurrency/listings/latest`, {
                headers: {
                    'X-CMC_PRO_API_KEY': this._apiKey || '',
                },
                params: {
                    convert: refCurrency,
                    limit: LIMIT,
                },
            })
            .pipe(
                takeUntilDestroyed(this._destroyRef),
                map(({ data }) =>
                    data.map((currencyRaw) => ({
                        ...currencyRaw,
                        price: currencyRaw.quote[refCurrency].price,
                        market_cap: currencyRaw.quote[refCurrency].market_cap,
                    })),
                ),
            );
    }
}
