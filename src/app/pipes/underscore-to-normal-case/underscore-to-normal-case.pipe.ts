import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'underscoreToNormalCase',
    standalone: true,
})
export class UnderscoreToNormalCasePipe implements PipeTransform {
    transform(str: string): string {
        return str.replace(/_/g, ' ');
    }
}
