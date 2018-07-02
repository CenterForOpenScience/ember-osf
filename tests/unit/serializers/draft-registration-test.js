import { moduleForModel, test } from 'ember-qunit';

moduleForModel('draft-registration', 'Unit | Serializer | draft registration', {
  // Specify the other units that are required for this test.
  needs: ['serializer:draft-registration', 'model:node', 'model:user', 'model:draft-registration', 'model:registration-metaschema']
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
  let record = this.subject();

  let serializedRecord = record.serialize();

  assert.ok(serializedRecord);
});
