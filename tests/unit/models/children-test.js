import { moduleForModel, test } from 'ember-qunit';

moduleForModel('children', 'Unit | Model | children', {
  // Specify the other units that are required for this test.
  needs: ['model:node', 'model:user', 'model:contributor', 'model:comment', 'model:institution', 'model:registration', 'model:file-provider', 'model:log']

});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});
