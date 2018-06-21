import { moduleForModel, test } from 'ember-qunit';

moduleForModel('draft-registration', 'Unit | Model | draft registration', {
  // Specify the other units that are required for this test.
  needs: ['model:draft-registration', 'model:user', 'model:node', 'model:registration-metaschema']
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});
