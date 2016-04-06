import Ember from 'ember';
import OsfLoginRouteMixin from '../../../mixins/osf-login-route';
import { module, test } from 'qunit';

module('Unit | Mixin | osf login route');

// Replace this with your real tests.
test('it works', function(assert) {
  let OsfLoginRouteObject = Ember.Object.extend(OsfLoginRouteMixin);
  let subject = OsfLoginRouteObject.create();
  assert.ok(subject);
});
