import { moduleFor } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';
import FactoryGuy, { manualSetup } from 'ember-data-factory-guy';


moduleFor('adapter:user', 'Unit | Adapter | user', {
    needs: [
        'model:user',
        'adapter:user',
        'serializer:user',
        'service:session',
    ],
    beforeEach() {
        manualSetup(this.container);
    }
});

test('#buildURL uses /users/ if q not present', function (assert) {
    const urlUsers = 'http://localhost:8000/v2/users/';
    const urlSearchUsers = 'http://localhost:8000/v2/search/users/';
    const adapter = this.subject();
    const user = FactoryGuy.make('user');
    const result = adapter.buildURL(
        'user',
        null,
        user._internalModel.createSnapshot(),
        'query',
        { notq: 'my_query' }
    );
    assert.notEqual(result, urlSearchUsers);
    assert.equal(result, urlUsers);
});

test('#buildURL uses /search/users/ if q present', function (assert) {
    const urlUsers = 'http://localhost:8000/v2/users/';
    const urlSearchUsers = 'http://localhost:8000/v2/search/users/';
    const adapter = this.subject();
    const user = FactoryGuy.make('user');
    const result = adapter.buildURL(
        'user',
        null,
        user._internalModel.createSnapshot(),
        'query',
        { q: 'my_query' }
    );
    assert.notEqual(result, urlUsers);
    assert.equal(result, urlSearchUsers);
});
