import { moduleFor, test } from 'ember-qunit';

moduleFor('adapter:children', 'Unit | Adapter | children', {
  // Specify the other units that are required for this test.
    needs: ['model:node']
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let adapter = this.subject();
  assert.ok(adapter);
});
