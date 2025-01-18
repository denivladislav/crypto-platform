import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingComponent } from './landing.component';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { routes } from '../../app.routes';
import { By } from '@angular/platform-browser';
import { signal } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CurrenciesStore } from '../../store';

describe('LandingComponent', () => {
    let component: LandingComponent;
    let fixture: ComponentFixture<LandingComponent>;
    let router: Router;
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
            imports: [LandingComponent, NoopAnimationsModule, HttpClientTestingModule],
            providers: [provideRouter(routes)],
        })
            .overrideProvider(CurrenciesStore, { useValue: mockCurrenciesStore })
            .compileComponents();

        fixture = TestBed.createComponent(LandingComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router);

        TestBed.flushEffects();
        fixture.autoDetectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should navigate', async () => {
        fixture.debugElement.query(By.css('a[href="/converter"]')).nativeElement.click();

        await fixture.whenStable();
        expect(router.url).toBe('/converter');
    });
});
