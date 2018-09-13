import Ember from 'ember';
import ContributorMixinMixin from '@centerforopenscience/ember-osf/mixins/contributor-mixin';
import { module, test } from 'qunit';

module('Unit | Mixin | contributor mixin');

// Replace this with your real tests.
test('it works', function(assert) {
  let ContributorMixinObject = Ember.Object.extend(ContributorMixinMixin);
  let subject = ContributorMixinObject.create();
  assert.ok(subject);
});
