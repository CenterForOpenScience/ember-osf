import Ember from 'ember';
import GenericDataAdapterMixin from 'ember-osf/mixins/generic-data-adapter';
import { module, test } from 'qunit';

module('Unit | Mixin | generic data adapter');

// Replace this with your real tests.
test('it works', function(assert) {
  let GenericDataAdapterObject = Ember.Object.extend(GenericDataAdapterMixin);
  let subject = GenericDataAdapterObject.create();
  assert.ok(subject);
});
