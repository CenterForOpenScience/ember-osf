import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
    layout,
    session: Ember.inject.service('session'),
    onSearchPage: false,
    gravatarUrl: null,
    fullName: null,

    // TODO: Make these parameters configurable from... somewhere. (currently set by OSF settings module)
    allowLogin: true,
    enableInstitutions: true,
});
