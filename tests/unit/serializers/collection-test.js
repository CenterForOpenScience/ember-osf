import { moduleForModel, test } from 'ember-qunit';

moduleForModel('collection', 'Unit | Serializer | collection', {
  // Specify the other units that are required for this test.
  needs: ['serializer:collection', 'serializer:node', 'model:node']
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
  let record = this.subject();

  let serializedRecord = record.serialize();

  assert.ok(serializedRecord);
});
