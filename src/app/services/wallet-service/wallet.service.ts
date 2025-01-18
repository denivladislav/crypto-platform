import { HttpClient } from '@angular/common/http';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Asset, AssetRaw } from './wallet.types';

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
}
