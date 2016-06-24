import Ember from 'ember';

export default Ember.Service.extend({
    store: Ember.inject.service(),
    session: Ember.inject.service(),
    currentUserId: Ember.computed('session.data.authenticated', function () {
	var session = this.get('session');
	if (session.get('isAuthenticated')) {
	    return session.get('data.authenticated.id');
	} else {
	    return null;
	}
    }),
    load() {
	return new Ember.RSVP.Promise((resolve, reject) => {
	    var currentUserId = this.get('currentUserId');
	    if (currentUserId) {		
		var currentUser = this.get('store').peekRecord('user', currentUserId);
		if (currentUser) {
		    resolve(currentUser);
		} else {
		    this.store.findRecord('user', currentUserId).then((user) => resolve(user), reject);
		}		
	    } else {
		reject();
	    }		
	});
    }
});
