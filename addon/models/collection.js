import DS from 'ember-data';

import OsfModel from '../mixins/osf-model';

export default DS.Model.extend(OsfModel, {
    title: DS.attr('string'),
    dateCreated: DS.attr('date'),
    dateModified: DS.attr('date'),
    bookmarks: DS.attr('boolean'),

    // nodeLinks: DS.hasMany('node-pointers'),
    // linkedNodes: DS.hasMany('node-pointers')

});
