import authUtils from 'dummy/utils/auth';

import {
    module,
    test
} from 'qunit';

module('Unit | Utility | auth');

test('getAuthUrl works', function(assert) {
    let result = authUtils.getAuthUrl();
    assert.ok(result);
});

test('getTokenFromHash works', function(assert) {
    let result = authUtils.getTokenFromHash('#access_token=foo');
    assert.equal(result, 'foo');
});
