import Ember from 'ember';
import { moduleFor } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';
import { task } from 'ember-concurrency';
import CurrentUser from 'ember-osf/services/current-user';

const currentUserStub = CurrentUser.extend({
    setWaffle: task(function* () {
        // do_nothing
    }),
})

moduleFor('service:current-user', 'Unit | Service | current user', {
    needs: ['service:session', 'service:features'],
    beforeEach() {
        this.register('service:current-user', currentUserStub);
    }
});

test('currentUser sessionKey computed property', function(assert) {
    Ember.run(() => {
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
});
