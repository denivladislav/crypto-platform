import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { distinctUntilChanged, pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { CurrenciesService, Currency } from '../services';

interface CurrenciesState {
    currencies: Currency[];
    isLoading: boolean;
    filter: { order: 'asc' | 'desc' };
}

const initialState: CurrenciesState = {
    currencies: [],
    isLoading: false,
    filter: { order: 'asc' },
};

export const CurrenciesStore = signalStore(
    withState(initialState),
    withComputed(({ currencies }) => ({
        currencies: computed(() => currencies()),
    })),
    withMethods((store, currenciesService = inject(CurrenciesService)) => ({
        loadByQuery: rxMethod<string>(
            pipe(
                distinctUntilChanged(),
                tap(() => patchState(store, { isLoading: true })),
                switchMap(() =>
                    currenciesService.getCurrencies().pipe(
                        tapResponse({
                            next: (currencies) => patchState(store, { currencies }),
                            error: (err) => console.error(err),
                            finalize: () => patchState(store, { isLoading: false }),
                        }),
                    ),
                ),
            ),
        ),
    })),
);
