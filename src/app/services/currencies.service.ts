import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Currency, GenericResponse } from './currencies.types';

const LIMIT = 10;

@Injectable({
    providedIn: 'root',
})
export class CurrenciesService {
    private _http = inject(HttpClient);
    private _apiKey = environment.API_KEY;
    private _baseUrl = '/currenciesApi';

    getCurrencies(): Observable<Currency[]> {
        console.log(environment);
        console.log('BASE URL', this._baseUrl);
        console.log('API KEY', this._apiKey);
        return this._http
            .get<GenericResponse<Currency[]>>(`${this._baseUrl}/v1/cryptocurrency/listings/latest`, {
                headers: {
                    'X-CMC_PRO_API_KEY': this._apiKey || '',
                },
                params: {
                    limit: LIMIT,
                },
            })
            .pipe(map((response) => response.data));
    }
}
