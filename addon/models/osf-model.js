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
        this.eachRelationship((relationship, meta) => {
            let rel = relationship;
            this.get(rel).then(() => {
                var watch = rel;
                if (meta.kind === 'hasMany') {
                    watch = `${rel}.[]`;
                }
                this.addObserver(rel, () => {
                    var key = `_dirtyRelationships.${rel}`;
                    this.set(key, !Ember.isEmpty(this.get(key)));
                });
            });
        });
    }
});
