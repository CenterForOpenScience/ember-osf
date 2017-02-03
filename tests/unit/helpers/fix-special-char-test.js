import { fixSpecialCharHelper } from 'dummy/helpers/fix-special-char';
import { module, test } from 'qunit';

import { fixStringTestCases } from '../../fixtures/specialChars';

module('Unit | Helper | fix special char helper');


test('#fixSpecialCharHelper uses fixSpecialChar', function(assert) {
    assert.expect(fixStringTestCases.length);

    for (let [input, output] of fixStringTestCases) {
        let res = fixSpecialCharHelper([input]);
        assert.strictEqual(res, output);
    }
});
