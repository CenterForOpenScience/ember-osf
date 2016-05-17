/*
  Common properties and behaviors shared by all OSF APIv2 models
 */

import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Mixin.create({
    links: DS.attr('links'),
    embeds: DS.attr('embed')
});
