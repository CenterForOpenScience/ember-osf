
import { buildSecondaryNavLinks } from 'dummy/helpers/build-secondary-nav-links';
import { module, test } from 'qunit';

module('Unit | Helper | build secondary nav links');

test('returns preprints service links', function(assert) {
    let currentService = 'PREPRINTS';
    let session = {
        isAuthenticated: true
    };
  let links = buildSecondaryNavLinks([currentService, session]);
  assert.equal(links[0].name, 'Add a preprint');
  assert.equal(links[1].name, 'Search');
  assert.equal(links[2].name, 'Support');
});

