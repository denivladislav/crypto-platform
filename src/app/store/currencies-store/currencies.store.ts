import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { distinctUntilChanged, pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { CurrenciesService, Currency } from '../../services';

export const REF_CURRENCIES = ['USD', 'EUR', 'RUB'] as const;
export type RefCurrency = (typeof REF_CURRENCIES)[number];

interface CurrenciesState {
    currencies: Currency[];
    refCurrency: RefCurrency;
    isLoading: boolean;
}

const initialState: CurrenciesState = {
    currencies: [],
    refCurrency: 'USD',
    isLoading: false,
};

export const CurrenciesStore = signalStore(
    withState(initialState),
    withMethods((store, currenciesService = inject(CurrenciesService)) => ({
        setRefCurrency(newRefCurrency: RefCurrency): void {
            patchState(store, () => ({ refCurrency: newRefCurrency }));
        },
        loadCurrenciesByQuery: rxMethod<RefCurrency>(
            pipe(
                distinctUntilChanged(),
                tap(() => patchState(store, { isLoading: true })),
                // Slowing down requests for demonstration purposes
                // debounceTime(300),
                switchMap((query) => {
                    return currenciesService.getCurrencies(query).pipe(
                        tapResponse({
                            next: (currencies) => patchState(store, { currencies }),
                            error: (err) => console.error(err),
                            finalize: () => patchState(store, { isLoading: false }),
                        }),
                    );
                }),
            ),
        ),
    })),
);
