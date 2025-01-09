import { UnderscoreToNormalCasePipe } from './underscore-to-normal-case.pipe';

describe('UnderscoreToNormalCasePipe', () => {
    const dict: Record<string, string> = {
        hello: 'hello',
        hello_world: 'hello world',
        '': '',
    };

    it('should convert underscore to normal case', () => {
        const pipe = new UnderscoreToNormalCasePipe();
        Object.keys(dict).forEach((key) => {
            expect(pipe.transform(key)).toEqual(dict[key]);
        });
    });
});
