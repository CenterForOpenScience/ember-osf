/*
  Common properties and behaviors shared by all OSF APIv2 models
 */

import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Mixin.create({
    links: DS.attr('links'),
    embeds: DS.attr('embed'),

    relationshipLinks: DS.attr('links'),
    dirtyRelationships: Ember.computed('_dirtyRelationships', function() {
	var dirtyRelationships = this.get('_dirtyRelationships');
        return Object.keys(dirtyRelationships).map((rel) => {
	    if (rel === 'files') {
		return null;
	    }
	    if (dirtyRelationships[rel]) {
		return rel;
	    }
	    return null;
        }).filter(Boolean);
    }),
    _dirtyRelationships: {},
    onLoad: Ember.on('ready', function() {
        this.eachRelationship((rel) => {
            let update = function() {
                let key = `_dirtyRelationships.${rel}`;
                this.set(key, !Ember.isEmpty(this.get(key)));
            }.bind(this);

            this.get(rel).then(() => {
                this.addObserver(rel, update);
            });
        });
    })
});
