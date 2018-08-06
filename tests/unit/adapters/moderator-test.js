import {moduleFor} from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';
import FactoryGuy, {manualSetup} from 'ember-data-factory-guy';


moduleFor('adapter:moderator', 'Unit | Adapter | moderator', {
    needs: [
        'model:moderator',
        'adapter:moderator',
        'serializer:moderator',
        'service:session',
        'service:current-user',
    ],
    beforeEach() {
        manualSetup(this.container);
    }
});

test('#buildURL appends a trailing slash if missing', function (assert) {
    const url = 'http://localhost:8000/v2/preprint_providers/osf/moderators';
    const adapter = this.subject();
    const moderator = FactoryGuy.make('moderator');
    const result = adapter.buildURL(
        'moderator',
        null,
        moderator._internalModel.createSnapshot(),
        'query',
        { provider: 'osf' }
    );
    assert.notEqual(result, url);
    assert.equal(result.slice(-1), '/');
});

test('#buildURL query', function (assert) {
    const url = 'http://localhost:8000/v2/preprint_providers/osf/moderators/';
    const adapter = this.subject();
    const moderator = FactoryGuy.make('moderator');
    const result = adapter.buildURL(
        'moderator',
        null,
        moderator._internalModel.createSnapshot(),
        'query',
        { provider: 'osf' }
    );
    assert.equal(result, url);
});

test('#buildURL createRecord', function (assert) {
    const url = 'http://localhost:8000/v2/preprint_providers/osf/moderators/';
    const adapter = this.subject();
    const moderator = FactoryGuy.make('moderator');

    let snapshot = moderator._internalModel.createSnapshot();
    snapshot.record.provider = 'osf';

    const result = adapter.buildURL(
        'moderator',
        null,
        snapshot,
        'createRecord'
    );
    assert.equal(result, url);
});

test('#buildURL findRecord', function (assert) {
    const url = 'http://localhost:8000/v2/preprint_providers/osf/moderators/12345/';
    const adapter = this.subject();
    const moderator = FactoryGuy.make('moderator');

    let snapshot = moderator._internalModel.createSnapshot();
    snapshot.adapterOptions = { provider: 'osf' };

    const result = adapter.buildURL(
        'moderator',
        '12345',
        snapshot,
        'findRecord'
    );
    assert.equal(result, url);
});

test('#buildURL updateRecord', function (assert) {
    const url = 'http://localhost:8000/v2/preprint_providers/osf/moderators/12345/';
    const adapter = this.subject();
    const moderator = FactoryGuy.make('moderator');

    let snapshot = moderator._internalModel.createSnapshot();
    snapshot.adapterOptions = { provider: 'osf' };

    const result = adapter.buildURL(
        'moderator',
        '12345',
        snapshot,
        'updateRecord'
    );
    assert.equal(result, url);
});

test('#buildURL deleteRecord', function (assert) {
    const url = 'http://localhost:8000/v2/preprint_providers/osf/moderators/12345/';
    const adapter = this.subject();
    const moderator = FactoryGuy.make('moderator');

    let snapshot = moderator._internalModel.createSnapshot();
    snapshot.adapterOptions = { provider: 'osf' };

    const result = adapter.buildURL(
        'moderator',
        '12345',
        snapshot,
        'deleteRecord'
    );
    assert.equal(result, url);
});
