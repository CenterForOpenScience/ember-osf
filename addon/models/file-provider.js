import Ember from 'ember';
import DS from 'ember-data';

import OsfModel from './osf-model';

export default OsfModel.extend({
    name: DS.attr('string'),
    kind: DS.attr('string'),
    path: DS.attr('string'),
    provider: DS.attr('string'),
    files: DS.hasMany('file'),
    node: DS.belongsTo('node'),

    isFolder: Ember.computed.equal('kind', 'folder'),
    isProvider: true
});
