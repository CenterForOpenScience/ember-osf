import OsfAdapter from './osf-adapter';

export default OsfAdapter.extend({
    buildURL(_, __, snap) {
        // TOOD: delete me when https://github.com/CenterForOpenScience/ember-osf/pull/34 is merged

        // Modifies URL from /contributors to nodes/<nodeId>/contributors/ to match APIv2 route for creating contributors.
        var base = this._super(...arguments);
        var ar = base.split('/');
        ar.splice(4, 0, 'nodes/' + snap._attributes.nodeId);
        return ar.join('/');
    }
});
