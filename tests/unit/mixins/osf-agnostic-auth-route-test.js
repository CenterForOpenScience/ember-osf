import Ember from 'ember';
import OsfAgnosticAuthRouteMixin from 'ember-osf/mixins/osf-agnostic-auth-route';
import { module, test } from 'qunit';

module('Unit | Mixin | osf agnostic auth route');

// Replace this with your real tests.
test('it works', function(assert) {
  let OsfAgnosticAuthRouteObject = Ember.Object.extend(OsfAgnosticAuthRouteMixin);
  let subject = OsfAgnosticAuthRouteObject.create();
  assert.ok(subject);
});
