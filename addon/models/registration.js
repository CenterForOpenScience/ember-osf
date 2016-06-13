import DS from 'ember-data';

import Node from './node';

export default Node.extend({
    dateRegistered: DS.attr('date'),
    pendingRegistrationApproval: DS.attr('boolean'),
    embargoEndDate: DS.attr('date'),
    pendingEmbargoApproval: DS.attr('boolean'),
    withdrawn: DS.attr('boolean'),
    withdrawalJustification: DS.attr('string'),
    pendingWithdrawal: DS.attr('boolean'),

    registrationSupplement: DS.attr('string'),
    registeredMeta: DS.attr(),

    registeredFrom: DS.belongsTo('node', {
        inverse: 'registrations'
    }),
    registeredBy: DS.belongsTo('user', {
        inverse: null
    }),
    contributors: DS.hasMany('contributors'),
    comments: DS.hasMany('comments', {
        updateRequestType: 'POST'
    })
    //more relationship
});
