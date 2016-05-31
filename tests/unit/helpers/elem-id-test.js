import { elemId } from 'dummy/helpers/elem-id';
import { module, test } from 'qunit';
import Ember from 'ember';

module('Unit | Helper | elem id');

test('ID name is prefixed with guid for that component', function(assert) {
    let testObj = {};
    let testObjId = Ember.guidFor(testObj);

    let result = elemId([testObj, 'someid']);
    assert.equal(result, `${testObjId}-someid`);
});
