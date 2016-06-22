import { moduleForModel, test } from 'ember-qunit';

moduleForModel('metaschema', 'Unit | Model | metaschema', {
  // Specify the other units that are required for this test.
  needs: ['model:metaschema']
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});
