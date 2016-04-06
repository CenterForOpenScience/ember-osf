import Ember from 'ember';
import OsfLoginControllerMixin from '../../../mixins/osf-login-controller';
import { module, test } from 'qunit';

module('Unit | Mixin | osf login controller');

// Replace this with your real tests.
test('it works', function(assert) {
  let OsfLoginControllerObject = Ember.Object.extend(OsfLoginControllerMixin);
  let subject = OsfLoginControllerObject.create();
  assert.ok(subject);
});
