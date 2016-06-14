import arrayItemsAreEqual from 'dummy/utils/array-items-are-equal';
import { module, test } from 'qunit';

module('Unit | Utility | array items are equal');

test('it returns true if the two arrays contents are the same', function(assert) {
    var a = [1, 2, 3];
    var b = [1, 2, 3];
    
    let result = arrayItemsAreEqual(a, b);
    assert.ok(result);
});

test('it returns true if the two arrays contents are the same, but ordered differently', function(assert) {
    var a = [1, 2, 3];
    var b = [3, 1, 2];
    
    let result = arrayItemsAreEqual(a, b);
    assert.ok(result);
});

test('it returns false if the two arrays are different length', function(assert) {
    var a = [1, 2, 3];
    var b = [1, 2, 3, 4];
    
    let result = arrayItemsAreEqual(a, b);
    assert.notOk(result);
});

test('it returns false if the two arrays have different items', function(assert) {
    var a = [1, 2, 3];
    var b = [1, 4, 3];
    
    let result = arrayItemsAreEqual(a, b);
    assert.notOk(result);
});

test('it accepts a comparison function to compare array items', function(assert) {
    var compare = function(x, y) {
	return x.id === y.id;
    };
    
    var a = [
	{
	    id: 1
	}, {
	    id: 2
	}, {
	    id: 3
	}
    ];
    var b = [
	{
	    id: 1
	}, {
	    id: 3
	}, {
	    id: 2
	}
    ];
    
    let result = arrayItemsAreEqual(a, b, compare);
    assert.ok(result);
});
