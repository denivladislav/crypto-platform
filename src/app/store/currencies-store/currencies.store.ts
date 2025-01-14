import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { distinctUntilChanged, pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { CurrenciesService, Currency } from '../../services';

interface CurrenciesState {
    currencies: Currency[];
    isLoading: boolean;
}

const initialState: CurrenciesState = {
    currencies: [],
    isLoading: false,
};

export const CurrenciesStore = signalStore(
    withState(initialState),
    withMethods((store, currenciesService = inject(CurrenciesService)) => ({
        loadByQuery: rxMethod<string>(
            pipe(
                distinctUntilChanged(),
                tap(() => patchState(store, { isLoading: true })),
                // Slowing down requests for demonstration purposes
                // debounceTime(300),
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
