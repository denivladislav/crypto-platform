import { GetPreciseNumberPipe } from './get-precise-number.pipe';

describe('GetPreciseNumberPipe', () => {
    let pipe: GetPreciseNumberPipe;

    beforeEach(() => {
        pipe = new GetPreciseNumberPipe();
    });

    it('should return precise number, precision default', () => {
        expect(pipe.transform(10)).toBe('10');
        expect(pipe.transform(0.1)).toBe('0.1');
        expect(pipe.transform(33.888999)).toBe('33.89');
        expect(pipe.transform(0.00005111)).toBe('0.000051');
    });

    it('should return precise number, precision = 0', () => {
        expect(pipe.transform(10.881, 0)).toBe('10.881');
    });
});
