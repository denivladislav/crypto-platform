import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WalletComponent } from './wallet.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { CurrenciesStore } from '../../store/currencies-store';

describe('WatchlistComponent', () => {
    let component: WalletComponent;
    let fixture: ComponentFixture<WalletComponent>;
    let mockCurrenciesStore;

    const mockData: unknown = [];

    beforeEach(async () => {
        mockCurrenciesStore = {
            currencies: signal([]),
            isLoading: signal(false),
            refCurrency: signal('USD'),
            loadCurrenciesByQuery: jasmine.createSpy('loadCurrenciesByQuery').and.callFake(() => {
                mockCurrenciesStore!.currencies.set(mockData);
            }),
        };

        await TestBed.configureTestingModule({
            imports: [WalletComponent, NoopAnimationsModule, HttpClientTestingModule],
        })
            .overrideProvider(CurrenciesStore, { useValue: mockCurrenciesStore })
            .compileComponents();

        fixture = TestBed.createComponent(WalletComponent);
        component = fixture.componentInstance;

        TestBed.flushEffects();
        fixture.autoDetectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
