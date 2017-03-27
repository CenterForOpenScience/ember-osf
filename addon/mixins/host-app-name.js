import config from 'ember-get-config';
import Ember from 'ember';

export default Ember.Mixin.create({
    hostAppName: config.appName
});
