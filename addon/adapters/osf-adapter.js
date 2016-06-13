/*
  Base adapter class for all OSF APIv2 endpoints
 */
import Ember from 'ember';
import DS from 'ember-data';

import config from 'ember-get-config';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

let inflector = new Ember.Inflector(Ember.Inflector.defaultRules);

export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {
    authorizer: 'authorizer:osf-token',
    host: config.OSF.apiUrl,
    namespace: config.OSF.apiNamespace,
    buildURL(modelName, id, snapshot, requestType) {
        // Fix issue where CORS request failed on 301s: Ember does not seem to append trailing
        // slash to URLs for single documents, but DRF redirects to force a trailing slash
        var url = this._super(...arguments);
        if (requestType === 'deleteRecord' || requestType === 'updateRecord' || requestType === 'findRecord') {
            if (snapshot.record.get('links.self')) {
                url = snapshot.record.get('links.self');
            }
        }
        if (url.lastIndexOf('/') !== url.length - 1) {
            url += '/';
        }
        return url;
    },
    /**
     * Construct a URL for a relationship create/update/delete. Has the same
     * signature as buildURL, with the addition of a 'relationship' param
     *
     * @method _buildRelationshipURL
     * @param {String} relationship the relationship to build a url for
     * @return {String} a URL
     **/
    _buildRelationshipURL(modelName, id, snapshot, requestType, query, relationship) { // jshint ignore:line
        var links = relationship ? snapshot.record.get(
            `relationshipLinks.${Ember.String.underscore(relationship)}.links`
        ) : false;
        if (links && (links.self || links.related)) {
            return links.self ? links.self.href : links.related.href;
        } else {
            return this.buildURL(...arguments);
        }
    },
    _serializeHasMany(serialized) {
        if (serialized.length > 1) {
            serialized = {
                data: serialized.map(function(record) {
                    var data = record.data;
                    return data;
                })
            };
        } else {
            serialized = serialized[0];
        }
        return serialized;
    },
    _handleManyRequest(store, type, snapshot, query, relationship, serializer) {
        var relationMeta = snapshot.record[relationship].meta();
        var serialized = snapshot.hasMany(relationship)
            .filter(each => each.record.isNewOrDirty())
            .map(each => serializer.serialize(each));
        var options = Ember.merge({
                requestType: () => 'PATCH',
                isBulk: serialized => serialized.length > 1,
                url: this._buildRelationshipURL(type.modelName, snapshot.id, snapshot, 'updateRecord', query, relationship),
                serialized: this._serializeHasMany
            },
            relationMeta.options.updateRequest
        );
        return this.ajax(options.url, options.requestType(snapshot, relationship), {
            data: options.serialized(serialized),
            isBulk: options.isBulk(serialized)
        }).then(() => snapshot.record.clearDirtyRelationship(relationMeta));

    },
    updateRecord(store, type, snapshot, _, query) {
        var promises = null;
        var dirtyRelationships = snapshot.record.get('dirtyRelationships');
        if (dirtyRelationships.length) {
            promises = dirtyRelationships.map(relationship => {
                var relationMeta = snapshot.record[relationship].meta();
                var serialized;
                if (relationMeta.options.serializer) {
                    serialized = relationMeta.options.serializer(snapshot.record);
                } else {
                    var serializer = store.serializerFor(inflector.singularize(relationMeta.type));
                    if (relationMeta.kind === 'hasMany') {
                        return this._handleManyRequest(store, type, snapshot, query, relationship, serializer);
                    }
                    serialized = serializer.serialize(snapshot.belongsTo(relationship));
                }
                var url = this._buildRelationshipURL(type.modelName, snapshot.id, snapshot, 'updateRecord', query, relationship);
                return this.ajax(url, 'PATCH', {
                    data: serialized
                }).then(() => snapshot.record.clearDirtyRelationship(relationship));
            });
        }
        if (Object.keys(snapshot.record.changedAttributes()).length) {
            if (promises) {
                return this._super(...arguments).then(response => Ember.RSVP.allSettled(promises).then(() => response));
            }
            return this._super(...arguments);
        } else if (promises) {
            return Ember.RSVP.allSettled(promises).then(() => null);
        } else {
            return new Ember.RSVP.Promise((resolve) => resolve(null));
        }
    },
    ajaxOptions(_, __, options) {
        var ret = this._super(...arguments);
        if (options && options.isBulk) {
            ret.contentType = 'application/vnd.api+json; ext=bulk';
        }
        return ret;
    }
});
