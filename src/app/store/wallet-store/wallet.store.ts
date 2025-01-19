import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { WalletService, Asset, Transaction } from '../../services';
import { TransactionData } from '../../services/wallet-service/wallet.types';

interface WalletState {
    assets: Asset[];
    transactions: Transaction[];
    isLoading: boolean;
}

const initialState: WalletState = {
    assets: [],
    transactions: [],
    isLoading: false,
};

export const WalletStore = signalStore(
    withState(initialState),
    withMethods((store, walletService = inject(WalletService)) => ({
        loadAssetsAndTransactionsByQuery: rxMethod(
            pipe(
                tap(() => patchState(store, { isLoading: true })),
                // Slowing down requests for demonstration purposes
                // debounceTime(300)
                switchMap(() =>
                    walletService.getAssets().pipe(
                        switchMap((assets) => {
                            patchState(store, { assets });
                            return walletService.getTransactions().pipe(
                                tapResponse({
                                    next: (transactions) => patchState(store, { transactions }),
                                    error: (err) => console.error(err),
                                    finalize: () => patchState(store, { isLoading: false }),
                                }),
                            );
                        }),
                        tapResponse({
                            next: (res) => {
                                console.log('Assets retrieved successfully', res);
                            },
                            error: (err) => {
                                console.error('Error fetching assets and transactions:', err);
                                patchState(store, { isLoading: false });
                            },
                        }),
                    ),
                ),
            ),
        ),
        postTransaction: rxMethod<TransactionData>(
            pipe(
                tap(() => patchState(store, { isLoading: true })),
                switchMap((data: TransactionData) =>
                    walletService.postTransaction(data).pipe(
                        switchMap(() =>
                            walletService.getTransactions().pipe(
                                switchMap((transactions) => {
                                    patchState(store, { transactions });
                                    return walletService.getAssets().pipe(
                                        tapResponse({
                                            next: (assets) => {
                                                patchState(store, { assets, isLoading: false });
                                                console.log('Assets updated successfully:', assets);
                                            },
                                            error: (err) => {
                                                console.error('Error retrieving assets:', err);
                                                patchState(store, { isLoading: false });
                                            },
                                        }),
                                    );
                                }),
                            ),
                        ),
                        tapResponse({
                            next: (response) => {
                                console.log('Transaction post successful', response);
                            },
                            error: (err) => {
                                console.error('Error posting transaction:', err);
                                patchState(store, { isLoading: false });
                            },
                        }),
                    ),
                ),
            ),
        ),
    })),
);
