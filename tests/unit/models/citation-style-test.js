import { moduleForModel, test } from 'ember-qunit';

moduleForModel('citation-styles', 'Unit | Model | citation styles', {
  // Specify the other units that are required for this test.
  needs: []
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});
