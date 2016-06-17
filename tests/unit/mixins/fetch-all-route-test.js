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
