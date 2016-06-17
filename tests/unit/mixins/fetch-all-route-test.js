import Ember from 'ember';
import FetchAllRouteMixin from 'ember-osf/mixins/fetch-all-route';
import { module, test } from 'qunit';

module('Unit | Mixin | fetch all route');

// Replace this with your real tests.
test('it works', function(assert) {
    let FetchAllObject = Ember.Object.extend(FetchAllRouteMixin);
    let subject = FetchAllObject.create();
    assert.ok(subject);
});


// TODO
// Things I'd like to test...
// 1. Mock the fetch operation. Confirm that if we expect 3 pages of results, then a function will fire 3x by end of test (will need to block test execution until done?)
// 2. Confirm the modelPath variable contains the expected number of results when done
// 3. Test configuration of relationship fetching works as expected
