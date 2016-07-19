import Ember from 'ember';
import DS from 'ember-data';

import {
    moduleForModel
} from 'ember-qunit';
import test from 'dummy/tests/ember-sinon-qunit/test';

import FactoryGuy, {
    manualSetup
} from 'ember-data-factory-guy';

import OsfModel from 'ember-osf/models/osf-model';
const Model = OsfModel.extend({
    many: DS.hasMany('node'),
    belongs: DS.belongsTo('user')
});

moduleForModel('osf-model', 'Unit | Model | osf model', {
    needs: [
        'model:user', 'model:node', 'model:institution', 'model:registration', 'model:log', 'model:comment', 'model:contributor', 'model:file-provider', 'model:node-link', 'model:draft-registration',
        'serializer:node', 'serializer:user',
        'transform:links', 'transform:embed'
    ],
    beforeEach() {
        manualSetup(this.container);

        this.container.registry.register('model:dummy', Model);
        Ember.run(() => this.model = this.store().createRecord('dummy', {}));
    }
});

test('#resolveRelationship gets belongsTo', function(assert) {
    let rel = this.model.resolveRelationship('belongs');
    assert.equal(rel.key, 'belongs');
    // Test that the private members used by OsfModel exist
    assert.ok(rel.members);
    assert.ok(Array.isArray(rel.members.list));
    assert.ok(rel.canonicalMembers);
    assert.ok(Array.isArray(rel.canonicalMembers.list));
});

test('#resolveRelationship gets hasMany', function(assert) {
    let rel = this.model.resolveRelationship('many');
    assert.equal(rel.key, 'many');
    // Test that the private members used by OsfModel exist
    assert.ok(rel.members);
    assert.ok(Array.isArray(rel.members.list));
    assert.ok(rel.canonicalMembers);
    assert.ok(Array.isArray(rel.canonicalMembers.list));
});

test('#_findDirtyRelationships only checks relationships that have data and are loaded', function(assert) {
    var manies;
    Ember.run(() => {
        manies = ['foo', 'bar', 'baz'].map((t) => this.store().createRecord('node', {
            title: t
        }));
        this.model.get('many').pushObjects(manies);
    });
    let rel = this.model.resolveRelationship('many');
    rel.hasLoaded = false;
    rel.hasData = false;
    var dirtyRelationships = this.model._findDirtyRelationships({});
    assert.notOk(dirtyRelationships.many);
    rel.hasData = true;
    dirtyRelationships = this.model._findDirtyRelationships({});
    assert.notOk(dirtyRelationships.many);
    rel.hasLoaded = true;
    dirtyRelationships = this.model._findDirtyRelationships({});
    assert.ok(dirtyRelationships.many);
});

test('#_findDirtyRelationships finds dirtyRelationships for newly created records', function(assert) {
    var manies;
    var belongs;
    Ember.run(() => {
        manies = ['foo', 'bar', 'baz'].map((t) => this.store().createRecord('node', {
            title: t
        }));
        belongs = this.store().createRecord('user', {
            fullName: 'Tess Ter'
        });
        this.model.get('many').pushObjects(manies);
        this.model.set('belongs', belongs);
    });
    let rel = this.model.resolveRelationship('many');
    rel.hasLoaded = true;

    let dirtyRelationships = this.model._findDirtyRelationships({});
    assert.deepEqual(
        dirtyRelationships.many.create.map(im => im.id),
        manies.map(r => r._internalModel.id)
    );
    assert.deepEqual(dirtyRelationships.belongs.create[0].id, belongs._internalModel.id);
});

test('#_findDirtyRelationships finds dirtyRelationships for added records', function(assert) {
    var manies = FactoryGuy.makeList('node', 3);
    var belongs = FactoryGuy.make('user');
    this.model.get('many').pushObjects(manies);
    this.model.set('belongs', belongs);
    let rel = this.model.resolveRelationship('many');
    rel.hasLoaded = true;

    let dirtyRelationships = this.model._findDirtyRelationships({});
    assert.deepEqual(
        dirtyRelationships.many.add.map(im => im.id),
        manies.map(r => r._internalModel.id)
    );
    assert.deepEqual(dirtyRelationships.belongs.add[0].id, belongs._internalModel.id);
});

test('#_findDirtyRelationships finds dirtyRelationships for removed records', function(assert) {
    // The following is a little hackery to get the 'Dummy' model's canonicalState set
    var data = {
        relationships: {
            many: FactoryGuy.buildList('node', 3),
            belongs: FactoryGuy.build('user')
        }
    };
    Ember.run(() => this.store()._setupRelationships(this.model._internalModel, data));
    // End hackery

    let rel = this.model.resolveRelationship('many');
    var item = rel.members.list[1].record;
    Ember.run(() => {
        this.model.get('many').removeObject(item);
        this.model.set('belongs', null);
    });

    let dirtyRelationships = this.model._findDirtyRelationships({});
    assert.deepEqual(
        dirtyRelationships.many.remove[0].id,
        data.relationships.many.data[1].id
    );
    assert.deepEqual(dirtyRelationships.belongs.remove[0].id, data.relationships.belongs.data.id);
});
