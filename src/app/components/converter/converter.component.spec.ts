import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConverterComponent, DEFAULT_CURRENCY_FROM_AMOUNT } from './converter.component';
import { signal } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CurrenciesStore } from '../../store/currencies-store';

describe('ConverterComponent', () => {
    let component: ConverterComponent;
    let fixture: ComponentFixture<ConverterComponent>;
    let mockCurrenciesStore;

    const mockData = [
        {
            id: 1,
            name: 'Bitcoin',
            symbol: 'BTC',
            price: 10,
        },
        {
            id: 1027,
            name: 'Ethereum',
            symbol: 'ETH',
            price: 1,
        },
    ];

    beforeEach(async () => {
        mockCurrenciesStore = {
            currencies: signal([]),
            isLoading: signal(false),
            loadByQuery: jasmine.createSpy('loadByQuery').and.callFake(() => {
                mockCurrenciesStore!.currencies.set(mockData);
            }),
        };

        await TestBed.configureTestingModule({
            imports: [ConverterComponent, NoopAnimationsModule, HttpClientTestingModule],
        })
            .overrideProvider(CurrenciesStore, { useValue: mockCurrenciesStore })
            .compileComponents();

        fixture = TestBed.createComponent(ConverterComponent);
        component = fixture.componentInstance;

        TestBed.flushEffects();
        fixture.autoDetectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should render the converter with data', () => {
        const amountInput = fixture.nativeElement.querySelector('[name=amountInput]');
        expect(amountInput.value).toBe(String(DEFAULT_CURRENCY_FROM_AMOUNT));

        const currencyFromInput = fixture.nativeElement.querySelector('[name=currencyFromInput]');
        expect(currencyFromInput.value).toBe(mockData[0].symbol);

        const currencyToInput = fixture.nativeElement.querySelector('[name=currencyToInput]');
        expect(currencyToInput.value).toBe(mockData[1].symbol);

        const resultString = fixture.nativeElement.querySelector('#resultString');
        expect(resultString.textContent).toContain(
            `${String(DEFAULT_CURRENCY_FROM_AMOUNT)} ${mockData[0].symbol} = ${mockData[0].price / mockData[1].price} ${mockData[1].symbol}`,
        );
    });

    it('should swap the currencies', async () => {
        const swapButton = fixture.nativeElement.querySelector('#swapCurrencies');
        swapButton.click();

        await fixture.whenStable();

        const currencyFromInput = fixture.nativeElement.querySelector('[name=currencyFromInput]');
        expect(currencyFromInput.value).toBe(mockData[1].symbol);

        const currencyToInput = fixture.nativeElement.querySelector('[name=currencyToInput]');
        expect(currencyToInput.value).toBe(mockData[0].symbol);

        const resultString = fixture.nativeElement.querySelector('#resultString');
        expect(resultString.textContent).toContain(
            `${String(DEFAULT_CURRENCY_FROM_AMOUNT)} ${mockData[1].symbol} = ${mockData[1].price / mockData[0].price} ${mockData[0].symbol}`,
        );
    });

    it('should show error when amount is incorrect', async () => {
        const amountInput = fixture.nativeElement.querySelector('[name=amountInput]');
        amountInput.value = '';
        amountInput.dispatchEvent(new Event('input'));
        component.converterForm.controls.currencyFromAmount.markAsTouched();
        amountInput.blur();

        await fixture.whenStable();

        expect(component.converterForm.controls.currencyFromAmount.invalid).toBeTrue();
        const errorEl = fixture.nativeElement.querySelector('mat-error');
        expect(errorEl.textContent).toBe('Must be natural number');
    });

    it('should show error when currency is incorrect', async () => {
        const currencyFromInput = fixture.nativeElement.querySelector('[name=currencyFromInput]');
        component.converterForm.controls.currencyFrom.setValue('');
        currencyFromInput.dispatchEvent(new Event('input'));

        fixture.detectChanges();
        await fixture.whenStable();

        component.converterForm.controls.currencyFrom.markAsTouched();
        currencyFromInput.blur();

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.converterForm.controls.currencyFrom.invalid).toBeTrue();
        const errorEl = fixture.nativeElement.querySelector('mat-error');
        expect(errorEl.textContent).toBe('Invalid currency');
    });
});
