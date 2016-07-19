import { moduleForModel, test } from 'ember-qunit';

moduleForModel('guid', 'Unit | Model | guid', {
  // Specify the other units that are required for this test.
  needs: ['model:guid-referent']
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});
