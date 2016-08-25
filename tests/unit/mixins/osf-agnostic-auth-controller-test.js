import Ember from 'ember';
import OsfAgnosticAuthControllerMixin from 'ember-osf/mixins/osf-agnostic-auth-controller';
import { module, test } from 'qunit';

module('Unit | Mixin | osf agnostic auth controller');

// Replace this with your real tests.
test('it works', function(assert) {
  let OsfAgnosticAuthControllerObject = Ember.Object.extend(OsfAgnosticAuthControllerMixin);
  let subject = OsfAgnosticAuthControllerObject.create();
  assert.ok(subject);
});
