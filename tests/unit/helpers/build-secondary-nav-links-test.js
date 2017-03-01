
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

test('returns home service links authenticated', function(assert) {
    let currentService = 'HOME';
    let session = {
        isAuthenticated: true
    };
    let links = buildSecondaryNavLinks([currentService, session]);
    assert.equal(links[0].name, 'My Projects');
    assert.equal(links[1].name, 'Search');
});

test('returns home service links unauthenticated', function(assert) {
    let currentService = 'HOME';
    let session = {
        isAuthenticated: false
    };
    let links = buildSecondaryNavLinks([currentService, session]);
    assert.equal(links[0].name, 'Browse');
    assert.equal(links[1].name, 'Search');
    assert.equal(links[2].name, 'Support');
});

test('returns Registries service links', function(assert) {
    let currentService = 'REGISTRIES';
    let session = {
        isAuthenticated: true
    };
    let links = buildSecondaryNavLinks([currentService, session]);
    assert.equal(links[0].name, 'Search');
    assert.equal(links[1].name, 'Support');
});

test('returns Meetings service links', function(assert) {
    let currentService = 'MEETINGS';
    let session = {
        isAuthenticated: true
    };
    let links = buildSecondaryNavLinks([currentService, session]);
    assert.equal(links[0].name, 'Search');
});
