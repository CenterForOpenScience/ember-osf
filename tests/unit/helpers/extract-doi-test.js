
import { extractDoi } from 'dummy/helpers/extract-doi';
import { module, test } from 'qunit';

module('Unit | Helper | extract doi');

test('DOI successfully extracted', function(assert) {
    assert.equal(
        extractDoi(['http://dx.doi.org/10.1000/182']),
        '10.1000/182',
        'Expected DOI to be extracted'
    );
});
