import { ShortenNumberPipe } from './shorten-number.pipe';

describe('ShortenNumberPipe', () => {
    let pipe: ShortenNumberPipe;

    beforeEach(() => {
        pipe = new ShortenNumberPipe();
    });

    it('should shorten the number', () => {
        expect(pipe.transform(1)).toEqual('1');
        expect(pipe.transform(1000)).toEqual('1.00K');
        expect(pipe.transform(1000000)).toEqual('1.00M');
        expect(pipe.transform(1000000000)).toEqual('1.00B');
        expect(pipe.transform(1000000000000)).toEqual('1.00T');
    });

    it('should shorten the number with precision', () => {
        expect(pipe.transform(1, 0)).toEqual('1');
        expect(pipe.transform(1000, 3)).toEqual('1.000K');
        expect(pipe.transform(1000000, 0)).toEqual('1M');
        expect(pipe.transform(1000000000, 2)).toEqual('1.00B');
        expect(pipe.transform(1000000000000, 1)).toEqual('1.0T');
    });
});
