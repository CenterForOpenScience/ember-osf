import Model from 'ember-data/model';

export default Model.extend({
    target_type: DS.attr('string'),
    target_id: DS.attr('string'),
    data_: DS.attr()
});
