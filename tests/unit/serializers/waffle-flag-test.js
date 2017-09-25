import { moduleForModel, test } from 'ember-qunit';

moduleForModel('waffle-flag', 'Unit | Serializer | waffle flag', {
  // Specify the other units that are required for this test.
  needs: ['serializer:waffle-flag']
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
  let record = this.subject();

  let serializedRecord = record.serialize();

  assert.ok(serializedRecord);
});
