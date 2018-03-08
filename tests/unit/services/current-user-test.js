import { moduleFor, test } from 'ember-qunit';

moduleFor('service:current-user', 'Unit | Service | current user', {
  // Specify the other units that are required for this test.
  //   needs: ['service:session']
});

test('currentUser sessionKey computed property', function(assert) {
    let service = this.subject();
    let currentUserId = 'npugv';

    let hash = service.hashCode(currentUserId);

    service.set('currentUserId', currentUserId);
    assert.ok(service.get('sessionKey'));
    assert.strictEqual(service.get('sessionKey'), hash.toString());
    assert.ok(!Number.isNaN(+service.get('sessionKey')));

    service.set('currentUserId', null);
    assert.ok(service.get('sessionKey'));
    assert.ok(Number.isNaN(+service.get('sessionKey')));
});
