/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'app-custom-filter',
    standalone: true,
    imports: [MatFormFieldModule, MatInputModule],
    templateUrl: './custom-filter.component.html',
    styleUrl: './custom-filter.component.scss',
})
export class CustomFilterComponent {
    @Input() public label: MatLabel = 'Filter by currency name';
    @Input() public type = 'text';
    @Input() public placeholder = 'Type currency name';

    @Output() public blurEvent = new EventEmitter<string>();

    public onBlur(value: string) {
        this.blurEvent.emit(value);
    }
}
