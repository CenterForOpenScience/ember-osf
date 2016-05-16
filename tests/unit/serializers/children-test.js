import { moduleForModel, test } from 'ember-qunit';

moduleForModel('children', 'Unit | Serializer | children', {
  // Specify the other units that are required for this test.
  needs: ['serializer:children', 'model:children', 'model:node', 'transform:links', 'transform:embed', 'model:institution',
  'model:contributor', 'model:comment', 'model:file-provider', 'model:registration', 'model:log']
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
  let record = this.subject();

  let serializedRecord = record.serialize();

  assert.ok(serializedRecord);
});
