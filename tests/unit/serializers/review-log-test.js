import { moduleForModel, test } from 'ember-qunit';

moduleForModel('review-log', 'Unit | Serializer | review log', {
  // Specify the other units that are required for this test.
  needs: ['serializer:review-log']
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
  let record = this.subject();

  let serializedRecord = record.serialize();

  assert.ok(serializedRecord);
});
