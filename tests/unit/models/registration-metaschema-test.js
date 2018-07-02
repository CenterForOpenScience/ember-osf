import { moduleForModel, test } from 'ember-qunit';

moduleForModel('registration-metaschema', 'Unit | Model | registration-metaschema', {
  // Specify the other units that are required for this test.
  needs: ['model:registration-metaschema']
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});
