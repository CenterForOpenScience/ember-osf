
import { fixSpecialCharHelper } from 'dummy/helpers/fix-special-char-helper';
import { module, test } from 'qunit';

module('Unit | Helper | fix special char helper');


const testCases = [
    ['a regular string', 'a regular string'],
    ['multiple &amp; sequences all become &amp;', 'multiple & sequences all become &'],
    ['', ''],
    ['for now, intentionally limit which characters are fixed &amp; &lt; &gt;', 'for now, intentionally limit which characters are fixed & &lt; &gt;'],
    [null, null]
];


test('#fixSpecialCharHelper uses fixSpecialChar', function(assert) {
    assert.expect(testCases.length);

    for (let [input, output] of testCases) {
        let res = fixSpecialCharHelper([input]);
        assert.equal(res, output);
    }
});
