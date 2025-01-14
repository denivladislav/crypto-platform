import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomFilterComponent } from './custom-filter.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('CustomFilterComponent', () => {
    let component: CustomFilterComponent;
    let fixture: ComponentFixture<CustomFilterComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CustomFilterComponent, NoopAnimationsModule],
        }).compileComponents();

        fixture = TestBed.createComponent(CustomFilterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
