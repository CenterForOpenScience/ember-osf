/*
  Common properties and behaviors shared by all OSF APIv2 models
 */

import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
    links: DS.attr('links'),
    embeds: DS.attr('embed'),

    relationshipLinks: Ember.computed.alias('links.relationships'),
    _dirtyRelationships: null,
    dirtyRelationships: Ember.computed('_dirtyRelationships', function() {
        var dirtyRelationships = this.get('_dirtyRelationships');
        return Object.keys(dirtyRelationships).filter(k => dirtyRelationships[k]);
    }).volatile(),
    clearDirtyRelationship: function(relationship) {
        this.set(`_dirtyRelationships.${relationship}`, false);
        // Also clean the inverse relationship
        var relatedMeta = this[relationship].meta();
        // A slight hack to get the related record w/o an API call
        if (relatedMeta.kind === 'hasMany') {
            this._internalModel._relationships.initializedRelationships[relationship].canonicalState.forEach(internalModel => {
                internalModel.record.set(`_dirtyRelationships.${relatedMeta.options.inverse}`, false);
            });
        }
        // else {
        //     // TODO: belongsTo
        // }

    },
    ready() {
        this._super(...arguments);
        this.set('_dirtyRelationships', Ember.Object.create({}));
    },
    save() {
        this.eachRelationship((rel, meta) => {
            if (meta.kind === 'hasMany') {
                var relation = this.hasMany(rel).hasManyRelationship;
                if (relation.record.isLoaded()) {
                    if (
                        (relation.canonicalState.filter(record => record && (Object.keys(record.changedAttributes()).length > 0 || record.isNew())).length > 0) ||
                        relation.canonicalMembers.size !== relation.members.size
                    ) {
                        var key = `_dirtyRelationships.${rel}`;
                        this.set(key, true);
                    }
                }
            } else if (meta.kind === 'belongsTo') {
                var relation = this.belongsTo(rel).belongsToRelationship;
                if (relation.record.isLoaded()) {
                    var record = relation.members.list[0];
                    if (
                        (record && (record.isNew() || record.changedAttributes().length > 0)) ||
                        relation.canonicalMembers.size !== relation.members.size
                    ) {
                        var key = `_dirtyRelationships.${rel}`;
                        this.set(key, true);
                    }
                }

            }
        });
        this._super(...arguments);
    }
});
