import Ember from 'ember';
import layout from './template';

import config from 'ember-get-config';

export default Ember.Component.extend({
    layout,
    isDevMode: config.OSF.backend !== 'prod'
});
