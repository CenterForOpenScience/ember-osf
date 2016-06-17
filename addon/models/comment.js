import DS from 'ember-data';

import OsfModel from './osf-model';

/**
 * Model for OSF APIv2 comments. This model may be used with one of several API endpoints. It may be queried directly,
 *  or accessed via relationship fields.
 * For field and usage information, see:
 *    https://api.osf.io/v2/docs/#!/v2/Comment_Detail_GET
 *    https://api.osf.io/v2/docs/#!/v2/Node_Comments_List_GET
 *    https://api.osf.io/v2/docs/#!/v2/Registration_Comments_List_GET
 */
export default OsfModel.extend({
    // TODO validation: maxLength
    content: DS.attr('string'),
    page: DS.attr('string'),

    // TODO dynamic belongsTo
    //target TargetField(link_type='related', meta={'type': 'get_target_type'})
    user: DS.belongsTo('user'),
    node: DS.belongsTo('node'),
    replies: DS.hasMany('comment', {
        inverse: null
    }),

    //reports: DS.hasMany('comment-report'),

    dateCreated: DS.attr('date'),
    dateModified: DS.attr('date'),
    modified: DS.attr('boolean'),
    deleted: DS.attr('boolean'),
    isAbuse: DS.attr('boolean'),
    hasChildren: DS.attr('boolean'),
    canEdit: DS.attr('boolean')
});
