import DS from 'ember-data';

import OsfModel from 'ember-osf/models/base';

export default OsfModel.extend({
    title: DS.attr('string'),
    registration: DS.attr('boolean'),
    public: DS.attr('boolean'),
    category: DS.attr('string'),
    fork: DS.attr('boolean'),
    description: DS.attr('string'),
    collection: DS.attr('boolean'),

    dateCreated: DS.attr('date'),
    dateModified: DS.attr('date'),
    dateRegistered: DS.attr('date'),

    pendingRegistrationApproval: DS.attr('boolean'),

    embargoEndDate: DS.attr('date'),
    pendingEmbargoApproval: DS.attr('boolean'),
    withdrawn: DS.attr('boolean'),
    withdrawalJustification: DS.attr('string'),
    pendingWithdrawal: DS.attr('boolean'),

    registrationSupplement: DS.attr('string'),
    registeredMeta: DS.attr(),
    tags: DS.attr(),

    affiliatedInstitutions: DS.hasMany('institutions', {
        inverse: 'registrations'
    }),
    registeredFrom: DS.belongsTo('node', {
        inverse: 'registrations'
    }),
    registeredBy: DS.belongsTo('user'),
    contributors: DS.hasMany('contributors'),
    comments: DS.hasMany('comments')
    //more relationship

});
