
import { shareDetailURL } from 'dummy/helpers/share-detail-url';
import { module, test } from 'qunit';

module('Unit | Helper | share detail url');

// Replace this with your real tests.
test('it works', function(assert) {
    const type = 'retraction';
    const id= '12345';
    let result = shareDetailURL([type, id]);
     assert.equal(result, '/nowhere/retraction/12345');
});
