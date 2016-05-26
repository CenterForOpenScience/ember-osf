import { elemId } from 'dummy/helpers/elem-id';
import { module, test } from 'qunit';
import Ember from 'ember';

module('Unit | Helper | elem id');

// Replace this with your real tests.
test('it works', function(assert) {
    let testObj = {};
    let testObjId = Ember.guidFor(testObj);

    let result = elemId([testObj, 'someid']);
    assert.equal(result, `${testObjId}-someid`);
});
