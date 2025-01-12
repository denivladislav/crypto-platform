import { UnderscoreToNormalCasePipe } from './underscore-to-normal-case.pipe';

describe('UnderscoreToNormalCasePipe', () => {
    let pipe: UnderscoreToNormalCasePipe;
    let dict: Record<string, string>;

    beforeEach(() => {
        pipe = new UnderscoreToNormalCasePipe();
        dict = {
            hello: 'hello',
            hello_world: 'hello world',
            '': '',
        };
    });

    it('should convert underscore to normal case', () => {
        Object.keys(dict).forEach((key) => {
            expect(pipe.transform(key)).toEqual(dict[key]);
        });
    });
});
