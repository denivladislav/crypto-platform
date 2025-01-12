import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'getPreciseNumber',
    standalone: true,
})
export class GetPreciseNumberPipe implements PipeTransform {
    transform(value: number, precision = 2): string {
        if (!precision) {
            return String(value);
        }

        const [integer, fractional] = String(value).split('.');

        if (!fractional || Number(fractional) === 0) {
            return String(integer);
        }

        if (fractional.length < precision) {
            return `${integer}.${fractional}`;
        }

        const truncatedFraction = parseFloat(`0.${fractional}`).toPrecision(precision).split('.')[1];

        return `${integer}.${truncatedFraction}`;
    }
}
