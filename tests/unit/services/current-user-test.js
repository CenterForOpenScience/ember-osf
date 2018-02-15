import { moduleFor, test } from 'ember-qunit';

moduleFor('service:current-user', 'Unit | Service | current user', {
  // Specify the other units that are required for this test.
  // needs: ['service:foo']
});

test('currentUser preferenceKey computed property', function(assert) {
    let service = this.subject();
    let currentUserId = 'npugv';

    service.set('currentUserId', currentUserId);
    assert.strictEqual(service.get('esPreferenceKey'),
        encodeURIComponent(`$^${currentUserId}#@`));

    service.set('currentUserId', null);

    assert.ok(service.get('esPreferenceKey'));
    assert.strictEqual(service.get('esPreferenceKey').length, 10);
});
