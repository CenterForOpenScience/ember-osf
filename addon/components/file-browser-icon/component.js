import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  layout,
  tagName: 'span',
  attributeBindings: ['style'],

  // TODO: use classNames and a stylesheet
  style: 'width: 20px; display: inline-block; cursor: pointer;',

  click() {
      this.toggleProperty('row.expanded');
  }
});
