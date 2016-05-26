import DS from 'ember-data';

import OsfModel from '../mixins/osf-model';

export default DS.Model.extend(OsfModel, {
    title: DS.attr('string'),
    dateCreated: DS.attr('date'),
    dateModified: DS.attr('date'),
    bookmarks: DS.attr('boolean'),
    // nodeLinks: DS.hasMany('node-links', {
    //     inverse:null
    // }),
    linkedNodes: DS.hasMany('nodes', {
        inverse: null
    })
});
