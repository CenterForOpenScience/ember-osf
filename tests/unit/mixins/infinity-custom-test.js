import Ember from 'ember';
import InfinityCustomMixin from 'ember-osf/mixins/infinity-custom';
import { module, test } from 'qunit';

module('Unit | Mixin | infinity custom');

// Replace this with your real tests.
test('it works', function(assert) {
  let InfinityCustomObject = Ember.Object.extend(InfinityCustomMixin);
  let subject = InfinityCustomObject.create();
  assert.ok(subject);
});
