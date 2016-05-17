/*
  Common properties and behaviors shared by all OSF APIv2 models
 */

import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Mixin.create({
    links: DS.attr('links'),
    embeds: DS.attr('embed'),

    relationshipLinks: DS.attr('links'),
    dirtyRelationships: {},
    onLoad: Ember.on('ready', function() {
	this.eachRelationship((rel) => {
	    let update = function() {
		let key = `dirtyRelationships.${rel}`;
		this.set(key, !Ember.isEmpty(this.get(key)));
	    }.bind(this);

	    this.get(rel).then(() => {
		this.addObserver(rel, update);
	    });
	});
    })
});
