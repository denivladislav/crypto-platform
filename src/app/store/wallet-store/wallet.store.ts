import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { debounceTime, distinctUntilChanged, pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { WalletService, Asset } from '../../services';

interface WalletState {
    assets: Asset[];
    deposit: Asset | undefined;
    transactions: unknown;
    isLoading: boolean;
}

const initialState: WalletState = {
    assets: [],
    deposit: undefined,
    transactions: [],
    isLoading: false,
};

export const WalletStore = signalStore(
    withState(initialState),
    withMethods((store, walletService = inject(WalletService)) => ({
        loadAssetsByQuery: rxMethod(
            pipe(
                distinctUntilChanged(),
                tap(() => patchState(store, { isLoading: true })),
                // Slowing down requests for demonstration purposes
                debounceTime(300),
                switchMap(() => {
                    return walletService.getAssets().pipe(
                        tapResponse({
                            next: (assets) => patchState(store, { assets }),
                            error: (err) => console.error(err),
                            finalize: () => patchState(store, { isLoading: false }),
                        }),
                    );
                }),
            ),
        ),
        // loadTransactionsByQuery: rxMethod<string>(
        //     pipe(
        //         distinctUntilChanged(),
        //         tap(() => patchState(store, { isLoading: true })),
        //         // Slowing down requests for demonstration purposes
        //         debounceTime(300),
        //         switchMap(() => {
        //             return walletService.getTransactions().pipe(
        //                 tapResponse({
        //                     next: (transactions) => patchState(store, { transactions }),
        //                     error: (err) => console.error(err),
        //                     finalize: () => patchState(store, { isLoading: false }),
        //                 }),
        //             );
        //         }),
        //     ),
        // ),
    })),
);
