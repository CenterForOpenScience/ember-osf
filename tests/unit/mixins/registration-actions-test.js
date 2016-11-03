import Ember from 'ember';
import RegistrationActionsMixin from 'ember-osf/mixins/registration-actions';
import { module, test } from 'qunit';

module('Unit | Mixin | registration actions');

// Replace this with your real tests.
test('it works', function(assert) {
  let RegistrationActionsObject = Ember.Object.extend(RegistrationActionsMixin);
  let subject = RegistrationActionsObject.create();
  assert.ok(subject);
});
