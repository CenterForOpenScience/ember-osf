import Ember from 'ember';
import OsfTokenLoginRouteMixin from '../../../mixins/osf-token-login-route';
import { module, test } from 'qunit';

module('Unit | Mixin | osf token login route');

// Replace this with your real tests.
test('it works', function(assert) {
  let OsfLoginRouteObject = Ember.Object.extend(OsfTokenLoginRouteMixin);
  let subject = OsfLoginRouteObject.create();
  assert.ok(subject);
});
