import Ember from 'ember';
import layout from './template';

// use: {{file-browser rootNode=node onClickFile=(action fileDetail)}}
export default Ember.Component.extend({
  layout,
});
