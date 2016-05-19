import DS from 'ember-data';

import OsfModel from '../mixins/osf-model';

export default DS.Model.extend(OsfModel, {
    title: DS.attr('string'),
    dateCreated: DS.attr('date'),
    dateModified: DS.attr('date'),

    // nodeLinks: DS.hasMany('node-pointers'),
    // linkedNodes: DS.hasMany('node-pointers')

});
