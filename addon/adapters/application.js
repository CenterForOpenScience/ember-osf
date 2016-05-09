import Ember from 'ember';
import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import UrlTemplates from "ember-data-url-templates";

import config from 'ember-get-config';

export default DS.JSONAPIAdapter.extend(UrlTemplates, DataAdapterMixin, {
    authorizer: 'authorizer:osf-token',
    host: config.OSF.apiUrl,
    urlTemplate: '{+host}{modelName}{/id}/',
    urlSegments: {
	modelName (modelName) {
	    return Ember.String.pluralize(modelName);
	}
    }
});
