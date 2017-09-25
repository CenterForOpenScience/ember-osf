import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr('fixstring'),
    note: DS.attr('fixstring'),
    active: DS.attr('boolean'),
    switchDefault: DS.attr('boolean')

});
