import Ember from 'ember';
import KeenTrackerMixin from 'ember-osf/mixins/keen-tracker';
import { module, test } from 'qunit';

module('Unit | Mixin | keen tracker');

// Replace this with your real tests.
test('it works', function(assert) {
  let KeenTrackerObject = Ember.Object.extend(KeenTrackerMixin);
  let subject = KeenTrackerObject.create();
  assert.ok(subject);
});
