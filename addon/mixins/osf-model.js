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
            if (rel === 'files' || rel === 'node' || rel === 'user') {
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
        this.eachRelationship((rel, meta) => {
            var _this = this;
            function update() {
                var key = `_dirtyRelationships.${rel}`;
                _this.set(key, !Ember.isEmpty(_this.get(key)));
            }

            this.get(rel).then(() => {
                var watch = rel;
                if (meta.kind === 'hasMany') {
                    watch = `${rel}.[]`;
                }
                this.addObserver(rel, update);
            });
        });
    })
});
