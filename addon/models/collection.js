import DS from 'ember-data';

import OsfModel from './osf-model';

export default OsfModel.extend({
    title: DS.attr('string'),
    dateCreated: DS.attr('date'),
    dateModified: DS.attr('date')

    // nodeLinks: DS.hasMany('node-pointers'),
    // linkedNodes: DS.hasMany('node-pointers')

});
