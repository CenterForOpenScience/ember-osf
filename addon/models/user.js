import DS from 'ember-data';

export default DS.Model.extend({
    given_name: DS.attr('string'),
    middle_names: DS.attr(),
    family_name: DS.attr('string'),

    nodes: DS.hasMany('nodes')
});
