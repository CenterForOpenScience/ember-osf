import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
    layout,
    // Where to send a POST request for login
    submitUrl: 'http://localhost:8080/login?service=http://localhost:4200/&amp;auto=true'  // TODO: Don't hard-code
});
