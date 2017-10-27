import pathJoin from 'ember-osf/utils/path-join';
import { module, test } from 'qunit';

module('Unit | Utility | path join');

test('it works', function(assert) {
    let result = pathJoin('/this/', 'has', 'all/', '/combos', '/of-slashes');
    assert.equal(result, '/this/has/all/combos/of-slashes');
});
