import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WatchlistComponent } from './watchlist.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { CurrenciesStore } from '../../store/currencies-store';

describe('WatchlistComponent', () => {
    let component: WatchlistComponent;
    let fixture: ComponentFixture<WatchlistComponent>;
    let mockCurrenciesStore;

    const mockData = [
        {
            id: 1,
            name: 'Bitcoin',
            symbol: 'BTC',
            circulating_supply: 19807318,
            quote: {
                USD: {
                    price: 95081.07331271806,
                    market_cap: 1879917000000,
                },
            },
        },
        {
            id: 1027,
            name: 'Ethereum',
            symbol: 'ETH',
            circulating_supply: 120477156.73077476,
            quote: {
                USD: {
                    price: 3350.1532278387904,
                    market_cap: 403954000000,
                },
            },
        },
    ];

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
            imports: [WatchlistComponent, NoopAnimationsModule, HttpClientTestingModule],
        })
            .overrideProvider(CurrenciesStore, { useValue: mockCurrenciesStore })
            .compileComponents();

        fixture = TestBed.createComponent(WatchlistComponent);
        component = fixture.componentInstance;

        TestBed.flushEffects();
        fixture.autoDetectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should render the table with data', () => {
        const rows = fixture.nativeElement.querySelectorAll('tr.mat-mdc-row');
        expect(rows.length).toBe(mockData.length);

        const firstRowCells = rows[0].querySelectorAll('td');
        expect(firstRowCells[0].textContent.trim()).toBe('Bitcoin');
    });
});
