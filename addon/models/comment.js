import DS from 'ember-data';

import OsfModel from '../mixins/osf-model';

export default DS.Model.extend(OsfModel, {
    type: DS.attr('string'),
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
