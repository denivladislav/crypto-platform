import { CapitalizePipe } from './capitalize.pipe';

describe('CapitalizePipe', () => {
    const dict: Record<string, string> = {
        hello: 'Hello',
        'hello world': 'Hello world',
        'hello-world': 'Hello-world',
        '': '',
    };

    it('should capitalize', () => {
        const pipe = new CapitalizePipe();
        Object.keys(dict).forEach((key) => {
            expect(pipe.transform(key)).toEqual(dict[key]);
        });
    });
});
