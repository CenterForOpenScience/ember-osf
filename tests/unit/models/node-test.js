import { moduleForModel, test } from 'ember-qunit';

moduleForModel('node', 'Unit | Model | node', {
  // Specify the other units that are required for this test.
    needs: ['model:user', 'model:contributor', 'model:comment']
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});
