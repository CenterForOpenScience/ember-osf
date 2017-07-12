import extractDoiFromString from 'dummy/utils/extract-doi-from-string';
import { module, test } from 'qunit';

module('Unit | Utility | extract doi from string');

test('return DOI when DOI found', function(assert) {
    assert.equal(
        extractDoiFromString('http://dx.doi.org/10.1000/182'),
        '10.1000/182',
        'Expected DOI for DOI URL containing valid DOI'
    );
    assert.equal(
        extractDoiFromString('doi:10.1000/182'),
        '10.1000/182',
        'Expected DOI for prefixed valid DOI'
    );
});

test('return original string when no DOI found', function(assert) {
    assert.equal(
        extractDoiFromString('12345'),
        '12345',
        'Expected original string for string without valid DOI'
    );
});
