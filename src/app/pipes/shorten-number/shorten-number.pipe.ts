import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'shortenNumber',
    standalone: true,
})
export class ShortenNumberPipe implements PipeTransform {
    transform(value: number, precision = 2): string {
        if (value < 0) {
            return `${value}`;
        }

        const powers = [
            { key: 'Q', value: Math.pow(10, 15) },
            { key: 'T', value: Math.pow(10, 12) },
            { key: 'B', value: Math.pow(10, 9) },
            { key: 'M', value: Math.pow(10, 6) },
            { key: 'K', value: 1000 },
        ];

        for (const power of powers) {
            if (value >= power.value) {
                return (value / power.value).toFixed(precision) + power.key;
            }
        }

        return `${value}`;
    }
}
