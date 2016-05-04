import DS from 'ember-data';

export default DS.Model.extend({
    category: DS.attr('string'),
    text: DS.belongsTo('comment')
});
