import OsfAdapter from './osf-adapter';
import config from 'ember-get-config';

export default OsfAdapter.extend({
    namespace: `${config.OSF.apiNamespace}/reviews`,
});
