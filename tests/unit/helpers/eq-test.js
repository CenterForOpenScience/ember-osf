import { eq } from 'dummy/helpers/eq';
import { module, test } from 'qunit';

module('Unit | Helper | eq');

test('asserts two values are equal', function(assert) {
    let result = eq(['yes', 'yes']);
    assert.equal(result, true);
});

test('asserts two values are not equal', function(assert) {
    let result = eq(['yes', 'no']);
    assert.equal(result, false);
});
