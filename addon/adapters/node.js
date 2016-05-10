import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
    buildURL(_, __, ___, requestType) {
	// Embed contributors
	var base = this._super(...arguments);
	if (requestType === 'GET') {
	    return `${base}?embed=contributors`;
	}
	else {
	    return base;
	}
    }
});
