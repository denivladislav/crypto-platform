import { HttpClient } from '@angular/common/http';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Asset, AssetRaw, Transaction, TransactionData, TransactionRaw } from './wallet.types';

@Injectable({
    providedIn: 'root',
})
export class WalletService {
    private _http = inject(HttpClient);
    private _destroyRef = inject(DestroyRef);
    private _walletBaseUrl = 'https://crypto-platform-backend.vercel.app';

    getAssets(): Observable<Asset[]> {
        return this._http.get<AssetRaw[]>(`${this._walletBaseUrl}/assets`).pipe(
            takeUntilDestroyed(this._destroyRef),
            map((data) =>
                data.map((asset) => ({
                    ...asset,
                    id: Number(asset.id),
                })),
            ),
        );
    }

    getTransactions(): Observable<Transaction[]> {
        return this._http.get<TransactionRaw[]>(`${this._walletBaseUrl}/transactions`).pipe(
            takeUntilDestroyed(this._destroyRef),
            map((data) =>
                data.map((transaction) => ({
                    ...transaction,
                    id: Number(transaction.id),
                })),
            ),
        );
    }

    postTransaction(data: TransactionData): Observable<unknown> {
        return this._http.post<Transaction>(`${this._walletBaseUrl}/transactions`, data.transaction).pipe(
            takeUntilDestroyed(this._destroyRef),
            switchMap((transaction) => {
                const newTransaction = {
                    ...transaction,
                    id: Number(transaction.id),
                };

                if (data.isExistingAsset && data.asset.amount === 0) {
                    return this._http.delete(`${this._walletBaseUrl}/assets/${data.asset.id}`).pipe(
                        map((newAsset) => {
                            return {
                                transaction: newTransaction,
                                assets: newAsset,
                            };
                        }),
                    );
                }

                if (data.isExistingAsset) {
                    return this._http.put(`${this._walletBaseUrl}/assets/${data.asset.id}`, data.asset).pipe(
                        map((newAsset) => {
                            return {
                                transaction: newTransaction,
                                assets: newAsset,
                            };
                        }),
                    );
                }

                return this._http.post(`${this._walletBaseUrl}/assets`, data.asset).pipe(
                    map((newAsset) => {
                        return {
                            transaction: newTransaction,
                            assets: newAsset,
                        };
                    }),
                );
            }),
        );
    }
}
