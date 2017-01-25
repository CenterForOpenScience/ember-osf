import fixSpecialChar from 'dummy/utils/fix-special-char';
import { module, test } from 'qunit';

module('Unit | Utility | fix special char');

// Replace this with your real tests.
test('fixSpecialChar works', function(assert) {
  let result = fixSpecialChar('test &');
  assert.equal(result, 'test &');
});
