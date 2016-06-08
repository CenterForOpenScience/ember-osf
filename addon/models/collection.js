import DS from 'ember-data';

import OsfModel from './osf-model';
import { serializeHasMany } from '../utils/serialize-relationship';

export default OsfModel.extend({
    title: DS.attr('string'),
    dateCreated: DS.attr('date'),
    dateModified: DS.attr('date'),
    bookmarks: DS.attr('boolean'),
    // nodeLinks: DS.hasMany('node-links', {
    //     inverse:null
    // }),
    linkedNodes: DS.hasMany('nodes', {
        inverse: null,
        serializer: serializeHasMany.bind(null, 'linkedNodes', 'linked_node')
    })

});
