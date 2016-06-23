import Ember from 'ember';
import layout from './template';
import config from 'ember-get-config';

export default Ember.Component.extend({
    layout,
    session: Ember.inject.service('session'),
    onSearchPage: false,
    gravatarUrl: null,
    fullName: null,
    host: config.OSF.url,

    // TODO: Make these parameters configurable from... somewhere. (currently set by OSF settings module)
    allowLogin: true,
    enableInstitutions: true,
    actions: {
        toggleSearch() {
            this.toggleProperty('showSearch');
        },
        logOut() {
            window.localStorage.clear();
            window.location.reload(true);
        }
    }
});
