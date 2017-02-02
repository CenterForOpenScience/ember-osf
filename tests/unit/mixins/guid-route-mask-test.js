import Ember from 'ember';
import GuidRouteMaskMixin from 'ember-osf/mixins/guid-route-mask';
import { module, test } from 'qunit';

module('Unit | Mixin | guid route mask');

// Replace this with your real tests.
test('it works', function(assert) {
  let GuidRouteMaskObject = Ember.Object.extend(GuidRouteMaskMixin);
  let subject = GuidRouteMaskObject.create();
  assert.ok(subject);
});
