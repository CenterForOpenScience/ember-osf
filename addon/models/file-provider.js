import Ember from 'ember';
import DS from 'ember-data';

import OsfModel from '../mixins/osf-model';

export default DS.Model.extend(OsfModel, {
    kind: DS.attr('string'),
    name: DS.attr('string'),
    path: DS.attr('string'),
    provider: DS.attr('string'),
    files: DS.hasMany('file'),
    node: DS.belongsTo('node'),

    isFolder: Ember.computed.equal('kind', 'folder')
});
