import DS from 'ember-data';

export default DS.Model.extend({
    links: DS.attr('links'),
    embeds: DS.attr('embed'),
});
