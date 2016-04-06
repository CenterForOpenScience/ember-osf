import Ember from 'ember';
import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

import config from 'ember-get-config';

export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {
    authorizer: 'authorizer:osf-token',

    host: config.OSF.apiUrl,
    pathForType: Ember.String.pluralize,
    urlForFindRecord (id, modelName/*, snapshot*/) {
        return `${this.get('host')}${Ember.String.pluralize(modelName)}/${id}/`;
    },
    urlForFindAll (modelName) {
        return `${this.get('host')}${Ember.String.pluralize(modelName)}/`;
    }
});
