
import { sortOptionDisplay } from 'dummy/helpers/sort-option-display';
import { module, test } from 'qunit';

module('Unit | Helper | sort option display');

test('returns corresponding display text', function(assert) {
    let sortOptions = [{sortBy: 'date', display: 'DATE'}];
    let result = sortOptionDisplay([sortOptions, 'date']);
    assert.equal(result, 'DATE');
});

