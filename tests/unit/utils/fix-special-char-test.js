import fixSpecialChar from 'dummy/utils/fix-special-char';
import { module, test } from 'qunit';

module('Unit | Utility | fix special char');

const testCases = [
    ['a regular string', 'a regular string'],
    ['multiple &amp; sequences all become &amp;', 'multiple & sequences all become &'],
    ['', ''],
    ['for now, intentionally limit which characters are fixed &amp; &lt; &gt;', 'for now, intentionally limit which characters are fixed & &lt; &gt;'],
    [null, null]
];


test('#fixSpecialChar converts values sent from the server into something display friendly', function(assert) {
    assert.expect(testCases.length);

    for (let [input, output] of testCases) {
        let res = fixSpecialChar(input);
        assert.equal(res, output);
    }
});
