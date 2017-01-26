import fixSpecialChar from 'dummy/utils/fix-special-char';
import { module, test } from 'qunit';

import { fixStringTestCases } from '../../fixtures/specialChars';

module('Unit | Utility | fix special char');


test('#fixSpecialChar converts values sent from the server into something display friendly', function(assert) {
    assert.expect(fixStringTestCases.length);

    for (let [input, output] of fixStringTestCases) {
        let res = fixSpecialChar(input);
        assert.strictEqual(res, output);
    }
});
