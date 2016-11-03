import Ember from 'ember';
import OsfTokenLoginControllerMixin from '../../../mixins/osf-token-login-controller';
import { module, test } from 'qunit';

module('Unit | Mixin | osf token login controller');

// Replace this with your real tests.
test('it works', function(assert) {
  let OsfLoginControllerObject = Ember.Object.extend(OsfTokenLoginControllerMixin);
  let subject = OsfLoginControllerObject.create();
  assert.ok(subject);
});
