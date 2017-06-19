import Ember from 'ember';

import {moduleFor, skip} from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';
import FactoryGuy, {manualSetup} from 'ember-data-factory-guy';

import DS from 'ember-data';
import JSONAPIAdapter from 'ember-data/adapters/json-api';

import OsfAdapter from 'ember-osf/adapters/osf-adapter';

moduleFor('adapter:osf-adapter', 'Unit | Adapter | osf adapter', {
    needs: [
        'model:comment', 'model:contributor', 'model:draft-registration', 'model:file-provider', 'model:citation',
        'model:institution', 'model:log', 'model:node', 'model:node-link', 'model:registration', 'model:user', 'model:preprint', 'model:wiki',
        'adapter:osf-adapter', 'adapter:node', 'adapter:user',
        'serializer:node',
        'service:session',
        'transform:links', 'transform:embed', 'transform:fixstring'
    ],
    beforeEach() {
        manualSetup(this.container);
    }
});

test('#buildURL appends a trailing slash if missing', function (assert) {
    var url = 'http://localhost:8000/v2/users/me';
    this.stub(
        DS.JSONAPIAdapter.prototype,
        'buildURL',
        function () {
            return url;
        }
    );
    let adapter = this.subject();
    let user = FactoryGuy.make('user');
    let result = adapter.buildURL(
        'user',
        'me',
        user._internalModel.createSnapshot(),
        'findRecord'
    );
    assert.notEqual(url, result);
    assert.equal(result.slice(-1), '/');
});

test('#buildURL _only_ appends a trailing slash if missing', function (assert) {
    var url = 'http://localhost:8000/v2/users/me/';
    this.stub(
        DS.JSONAPIAdapter.prototype,
        'buildURL',
        function () {
            return url;
        }
    );
    let adapter = this.subject();
    let user = FactoryGuy.make('user');
    let result = adapter.buildURL(
        'user',
        'me',
        user._internalModel.createSnapshot(),
        'findRecord'
    );
    assert.equal(url, result);
});

test('#buildURL uses relationship links if available for delete, update, and find', function (assert) {
    let url = 'http://localhost:8000/v2/users/me/rel/';
    let adapter = this.subject();
    let user = FactoryGuy.make('user', {
        links: {
            self: url
        }
    });
    ['delete', 'update', 'find'].forEach(verb => {
        let result = adapter.buildURL(
            'user',
            'me',
            user._internalModel.createSnapshot(),
            `${verb}Record`
        );
        assert.equal(url, result);
    });
});

test('#buildURL uses snapshot.adapterOptions.url if available', function (assert) {
    let url = 'http://localhost:8000/v2/users/me/rel/';
    let adapter = this.subject();
    let user = FactoryGuy.make('user', {
        links: null
    });

    let result = adapter.buildURL(
        'user',
        'me',
        user._internalModel.createSnapshot({
            adapterOptions: {
                url: url
            }
        }),
        'createRecord'
    );
    assert.equal(url, result);
});

test('#buildURL uses snapshot.adapterOptions.url if available', function (assert) {
    let url = 'http://localhost:8000/v2/users/me/rel/';
    let adapter = this.subject();
    let user = FactoryGuy.make('user', {
        links: null
    });

    let result = adapter.buildURL(
        'user',
        'me',
        user._internalModel.createSnapshot({
            adapterOptions: {
                url: url
            }
        }),
        'createRecord'
    );
    assert.equal(url, result);
});

test('#_buildRelationshipURL uses relationshipLinks', function (assert) {
    let url = 'http://localhost:8000/v2/users/me/foo-bar-baz/';
    let adapter = this.subject();
    let user = FactoryGuy.make('user', {
        links: {
            relationships: {
                nodes: {
                    links: {
                        related: {
                            href: url
                        }
                    }
                }
            }
        }
    });

    let result = adapter._buildRelationshipURL(
        user._internalModel.createSnapshot({
            adapterOptions: {
                url: url
            }
        }),
        'nodes'
    );
    assert.equal(url, result);
});

test('#_createRelated maps over each createdSnapshots and adds records to the parent\'s canonical state', function (assert) {
    assert.expect(5);
    this.inject.service('store');
    let store = this.store;

    let node = FactoryGuy.make('node');
    var contributors;
    Ember.run(() => {
        contributors = [
            store.createRecord('contributor', {
                title: 'Foo'
            }),
            store.createRecord('contributor', {
                title: 'Bar'
            })
        ];
    });
    node.get('contributors').pushObjects(contributors);
    let saveStubs = contributors.map(c => this.stub(c, 'save', () => {
        return Ember.RSVP.resolve();
    }));

    var addCanonicalStub = this.stub();
    this.stub(node, 'resolveRelationship', () => {
        return {
            addCanonicalRecord: addCanonicalStub
        };
    });

    Ember.run(() => {
        node.save().then(() => {
            saveStubs.forEach(s => assert.ok(s.called));
            assert.ok(addCanonicalStub.calledTwice);
            // Can't use calledWith because sinon's deepEqual creates
            // infinite recursive calls when comparing the Ember DS.Models
            assert.equal(addCanonicalStub.args[0][0], contributors[0]._internalModel, 'First contributor did not match');
            assert.equal(addCanonicalStub.args[1][0], contributors[1]._internalModel, 'Second contributor did not match');
        }).catch((err) => {
            assert.ok(false, 'An error occurred while running this test: ' + err);
        });
    });
});

test('#_createRelated passes the nested:true as an adapterOption to save', function (assert) {
    this.inject.service('store');
    let store = this.store;

    let node = FactoryGuy.make('node');
    Ember.run.begin();
    let contributors = [
        store.createRecord('contributor', {
            title: 'Foo'
        }),
        store.createRecord('contributor', {
            title: 'Bar'
        })
    ];
    Ember.run.end();
    node.get('contributors').pushObjects(contributors);
    let saveStubs = contributors.map(c => this.stub(c, 'save', () => {
        return Ember.RSVP.resolve();
    }));
    this.stub(node, 'resolveRelationship', () => {
        return {
            addCanonicalRecord: this.stub()
        };
    });

    Ember.run(() => {
        node.save().then(() => {
            saveStubs.forEach(s => assert.ok(s.called));
            saveStubs.forEach(s => assert.ok(s.calledWith({
                adapterOptions: {
                    url: null,
                    nested: true,
                    requestType: 'create'
                }
            })));
        }).catch((err) => {
            assert.ok(false, 'An error occurred while running this test: ' + err);
        });
    });
});

test('#_addRelated defers to _doRelatedRequest and adds records to the parent\'s canonical state', function (assert) {
    assert.expect(3);

    let node = FactoryGuy.make('node');
    let institution = FactoryGuy.make('institution');
    node.get('affiliatedInstitutions').pushObject(institution);

    var doRelatedStub = this.stub(OsfAdapter.prototype, '_doRelatedRequest', () => {
        return Ember.RSVP.resolve();
    });
    var relation = node.resolveRelationship('affiliatedInstitutions');
    relation.hasLoaded = true;
    var addCanonicalStub = this.stub(relation, 'addCanonicalRecord');

    Ember.run(() => {
        node.save().then(() => {
            assert.ok(doRelatedStub.called, 'doRelated should be called');
            assert.ok(addCanonicalStub.calledOnce, 'addCanonical should be called');
            assert.ok(addCanonicalStub.calledWith(institution._internalModel), 'addCanonical should be called with the institution');
        }).catch((err) => {
            assert.ok(false, 'An error occurred while running this test: ' + err);
        });
    });
});

test('#_updateRelated defers to _doRelatedRequest, pushes the update response into the store, and updates the parent\'s canonicalState', function (assert) {
    this.inject.service('store');
    let store = this.store;

    let node = FactoryGuy.make('node', 'hasContributors');
    var contribs = node.get('contributors');
    var contrib = contribs.objectAt(1);

    contrib.set('bibliographic', !contrib.get('bibliographic'));

    var doRelatedStub = this.stub(OsfAdapter.prototype, '_doRelatedRequest', () => {
        return Ember.RSVP.resolve({
            data: [
                // A slight hack-- ingore the value returned from _doRelatedRequest
                true
            ]
        });
    });
    var addCanonicalStub = this.stub();
    this.stub(node, 'resolveRelationship', () => {
        return {
            addCanonicalRecord: addCanonicalStub
        };
    });
    var pushStub = this.stub(store, 'push', () => contrib);
    var normalizeStub = this.stub(store, 'normalize');

    Ember.run(() => {
        node.save().then(() => {
            assert.ok(doRelatedStub.calledOnce);
            assert.ok(addCanonicalStub.calledOnce);
            assert.ok(pushStub.calledOnce);
            assert.ok(normalizeStub.calledOnce);
        }).catch((err) => {
            assert.ok(false, 'An error occurred while running this test: ' + err);
        });
    });
});


test('#_removeRelated defers to _doRelatedRequest, and removes the records from the parent\'s canonicalState', function (assert) {
    assert.expect(3);

    let node = FactoryGuy.make('node', 'hasInstitution');
    var inst = node.get('affiliatedInstitutions').objectAt(0);
    node.get('affiliatedInstitutions').removeObject(inst);

    var doRelatedStub = this.stub(OsfAdapter.prototype, '_doRelatedRequest', () => {
        return Ember.RSVP.resolve();
    });

    var rel = node.resolveRelationship('affiliatedInstitutions');
    var removeCanonicalStub = this.stub(rel, 'removeCanonicalRecord', removeCanonicalStub);
    rel.hasLoaded = true;

    Ember.run(() => {
        node.save().then(() => {
            assert.ok(doRelatedStub.calledOnce, 'doRelated should be called');
            assert.ok(removeCanonicalStub.calledOnce, 'removeCanonical should be called');
            assert.ok(removeCanonicalStub.calledWith(inst._internalModel), 'removeCanonical should be called with institution as an argument');
        }).catch((err) => {
            assert.ok(false, 'An error occurred while running this test: ' + err);
        });
    });
});

test('#_deleteRelated defers to _doRelatedRequest, and unloads the deleted records', function (assert) {
    assert.expect(2);
    let node = FactoryGuy.make('node', 'hasContributors');
    let contrib = node.get('contributors').objectAt(1);
    node.get('contributors').removeObject(contrib);

    var unloadStub = this.stub(contrib, 'unloadRecord');
    var doRelatedStub = this.stub(OsfAdapter.prototype, '_doRelatedRequest', () => {
        return Ember.RSVP.resolve();
    });

    Ember.run(() => {
        node.save().then(() => {
            assert.ok(doRelatedStub.calledOnce);
            assert.ok(unloadStub.calledOnce);
        }).catch((err) => {
            assert.ok(false, 'An error occurred while running this test: ' + err);
        });
    });
});

test('#_doRelatedRequest with array', function (assert) {
    let adapter = this.subject();

    this.inject.service('store');
    let store = this.store;

    let node = FactoryGuy.make('node');
    Ember.run.begin();
    let children = FactoryGuy.buildList('node', 3).data.map(json => {
        return store.createRecord('node', store.normalize('node', json).data.attributes);
    });
    Ember.run.end();

    var mockAjax = this.stub(adapter, 'ajax', () => {
        return Ember.RSVP.resolve({});
    });
    adapter._doRelatedRequest(
        store,
        node._internalModel.createSnapshot(),
        children.map(c => c._internalModel.createSnapshot()),
        'children',
        'http://localhost:8000/v2/nodes/foobar/children/',
        'POST'
    );
    var data = mockAjax.args[0][2].data.data;
    assert.equal(data[0].attributes.title, children[0].get('title'));
    assert.equal(data[1].attributes.title, children[1].get('title'));
    assert.equal(data[2].attributes.title, children[2].get('title'));
});

test('#_doRelatedRequest with single snapshot', function (assert) {
    let adapter = this.subject();

    this.inject.service('store');
    let store = this.store;

    let node = FactoryGuy.make('node');
    Ember.run.begin();
    let child = store.createRecord(
        'node',
        store.normalize('node', FactoryGuy.build('node').data).data.attributes
    );
    Ember.run.end();

    var mockAjax = this.stub(adapter, 'ajax', () => {
        return Ember.RSVP.resolve({});
    });
    adapter._doRelatedRequest(
        store,
        node._internalModel.createSnapshot(),
        child._internalModel.createSnapshot(),
        'children',
        'http://localhost:8000/v2/nodes/foobar/children/',
        'POST'
    );
    var data = mockAjax.args[0][2].data.data;
    assert.equal(data.attributes.title, child.get('title'));
});

test('#_handleRelatedRequest makes correct calls for each change argument', function (assert) {
    let adapter = this.subject();

    this.inject.service('store');
    let store = this.store;

    let node = FactoryGuy.make('node');
    let changes = {
        delete: FactoryGuy.makeList('node', 2),
        remove: FactoryGuy.makeList('node', 2),
        update: FactoryGuy.makeList('node', 2),
        add: FactoryGuy.makeList('node', 2),
        create: FactoryGuy.makeList('node', 2)
    };
    node.set('_dirtyRelationships', {
        children: changes
    });

    for (let verb of['delete', 'remove', 'update', 'add', 'create']) {
        let NodeAdapter = store.adapterFor('node');
        let relatedStub = this.stub(NodeAdapter, `_${verb}Related`);
        adapter._handleRelatedRequest(
            store,
            store.modelFor('node'),
            node._internalModel.createSnapshot(),
            'children',
            verb
        );
        assert.ok(relatedStub.called);
        assert.deepEqual(
            relatedStub.args[0][2].map(s => s.id),
            changes[verb].map(r => r.get('id'))
        );
    }
});

test('#_handleRelatedRequest checks if relationship supports bulk', function (assert) {
    let adapter = this.subject();

    this.inject.service('store');
    let store = this.store;

    let node = FactoryGuy.make('node');
    let changes = {
        update: FactoryGuy.makeList('node', 2),
        add: FactoryGuy.makeList('node', 2),
        create: FactoryGuy.makeList('node', 2)
    };
    node.set('_dirtyRelationships', {
        children: changes
    });
    let rel = node.resolveRelationship('children');
    var opts = {
        allowBulkUpdate: true,
        allowBulkCreate: false,
        allowBulkAdd: true
    };
    this.stub(rel, 'meta', () => opts);

    for (let verb of['update', 'add', 'create']) {
        let NodeAdapter = store.adapterFor('node');
        let relatedStub = this.stub(NodeAdapter, `_${verb}Related`);
        adapter._handleRelatedRequest(
            store,
            store.modelFor('node'),
            node._internalModel.createSnapshot(),
            'children',
            verb
        );
        assert.ok(relatedStub.called);
        assert.equal(
            opts[verb],
            relatedStub.args[0].pop()
        );
    }
});

test('#updateRecord handles both dirtyRelationships and the parent record', function (assert) {
    assert.expect(2);

    this.inject.service('store');

    const store = this.store;
    const adapter = this.subject();
    const node = FactoryGuy.make('node');

    Ember.run(() => node.set('title', 'The meaning of life'));

    node.set('_dirtyRelationships', {
        children: {
            update: null
        }
    });

    const handleRelatedStub = this.stub(adapter, '_handleRelatedRequest', () => []);
    // Have to stub apply due to ...arguments usage
    this.stub(JSONAPIAdapter.prototype.updateRecord, 'apply', () => Ember.RSVP.resolve(42));

    const ss = node._internalModel.createSnapshot();

    return adapter
        .updateRecord(store, node, ss).then(res => {
            // Note: 42 comes from promise resolution of stubbed updateRecord above
            assert.equal(res, 42);
            assert.ok(
                handleRelatedStub.calledWith(
                    store,
                    node,
                    ss,
                    'children',
                    'update'
                )
            );
        });
});

test('#ajaxOptions adds bulk contentType if request is bulk', function (assert) {
    let adapter = this.subject();
    var opts = adapter.ajaxOptions(null, null, {
        isBulk: true
    });
    assert.equal(opts.contentType, 'application/vnd.api+json; ext=bulk');
});

skip('#findRecord can embed(via include) data with findRecord', function (assert) {
    const done = assert.async();
    assert.expect(1);

    Ember.run(() => {
        this.inject.service('store');
        const store = this.store;
        const node = FactoryGuy.make('node');
        let children;

        return Ember.RSVP.Promise
            .all([
                store.createRecord('node', {
                    title: 'Foo'
                }),
                store.createRecord('node', {
                    title: 'Bar'
                })
            ])
            .then(res => {
                children = res;
                return node.get('children').pushObjects(res);
            })
            .then(() => {
                node.set('title', 'Parent');
                return store.findRecord('node', node.id, {include: 'children'});
            })
            .then(res => {
                assert.equal(
                    res.get('children').toArray()[0].get('title'),
                    children[0].get('title')
                );
            })
            .then(done);
    });
});
