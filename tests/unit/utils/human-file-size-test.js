import humanFileSize from 'ember-osf/utils/human-file-size';

import { module, test } from 'qunit';

module('Unit | Utility | human file size');

test('kilobytes', function(assert) {
    let result = humanFileSize(1000, true);
    assert.equal(result, '1.0 kB');
});

test('more kilobytes', function(assert) {
    let result = humanFileSize(10000, true);
    assert.equal(result, '10.0 kB');
});

test('kilobytes rounded', function(assert) {
    let result = humanFileSize(10203, true);
    assert.equal(result, '10.2 kB');
});

test('terabytes', function(assert) {
    let result = humanFileSize(1000000000000, true);
    assert.equal(result, '1.0 TB');
});

test('terabytes rounded', function(assert) {
    let result = humanFileSize(1099511627776, true);
    assert.equal(result, '1.1 TB');
});

test('tebibyte', function(assert) {
    let result = humanFileSize(1099511627776, false);
    assert.equal(result, '1.0 TiB')
})