import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'capitalize',
    standalone: true,
})
export class CapitalizePipe implements PipeTransform {
    transform(str: string): string {
        if (str.length === 0) {
            return str;
        }

        return `${str[0].toUpperCase()}${str.slice(1)}`;
    }
}
