import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
    buildURL(_, __, ___, requestType) {

        // Embed contributors
        var base = this._super(...arguments);
        base = base.substr(0, base.lastIndexOf("relationships"))
        var target_type = ___.attributes().target_type
        var target_id = ___.attributes().target_id
        return `${base}${target_type}/${target_id}/relationships/institutions/`
    },
});
