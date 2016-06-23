import DS from 'ember-data';

import OsfModel from './osf-model';
import { serializeHasMany } from '../utils/serialize-relationship';

/**
 * Model for OSF APIv2 collections
 * For field and usage information, see:
 *  https://api.osf.io/v2/docs/#!/v2/Collection_List_GET
 */
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
