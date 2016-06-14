import DS from 'ember-data';

import OsfModel from './osf-model';

export default OsfModel.extend({
    // TODO validation: maxLength
    content: DS.attr('string'),
    page: DS.attr('string'),

    // Placeholder for comment creation: allow specifying attributes that are sent to the server, but not as attributes
    // and both type and ID will be serialized into relationships field
    targetID: DS.attr('string'),
    targetType: DS.attr('string'),

    // TODO dynamic belongsTo
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
