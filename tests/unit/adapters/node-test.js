import { moduleFor, test } from 'ember-qunit';

moduleFor('adapter:node', 'Unit | Adapter | node', {
  // Specify the other units that are required for this test.
    needs: ['model:node']
});

test('it embeds contributors', function(assert) {
    let adapter = this.subject();

    let url = adapter.buildURL('nodes', null, null, 'GET', null);
    assert.ok(adapter);
});
