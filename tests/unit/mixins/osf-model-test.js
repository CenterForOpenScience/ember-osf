import Ember from 'ember';
import OsfModelMixin from 'ember-osf/mixins/osf-model';
import { module, test } from 'qunit';

module('Unit | Mixin | osf model');

// Replace this with your real tests.
test('it works', function(assert) {
  let OsfModelObject = Ember.Object.extend(OsfModelMixin);
  let subject = OsfModelObject.create();
  assert.ok(subject);
});
