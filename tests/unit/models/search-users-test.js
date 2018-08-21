import { moduleForModel, test } from 'ember-qunit';

moduleForModel('search-users', 'Unit | Model | search-users', {
  // Specify the other units that are required for this test.
  needs: [
    'model:node',
    'model:institution',
    'model:registration',
    'model:file',
    'model:review-action',
    'transform:fixstring',
    'transform:links',
    'transform:embed',
  ]
});

test('it exists', function(assert) {
  let model = this.subject();
  assert.ok(!!model);
});
