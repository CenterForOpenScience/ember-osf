import Ember from 'ember';
import DS from 'ember-data';
import { authenticatedAJAX } from 'ember-osf/utils/ajax-helpers';

/**
 * @module ember-osf
 * @submodule models
 */

/**
 * Common properties and behaviors shared by all OSF APIv2 models
 *
 * @class OsfModel
 * @public
 */
export default DS.Model.extend({
    links: DS.attr('links'),
    embeds: DS.attr('embed'),

    relationshipLinks: Ember.computed.alias('links.relationships'),
    _dirtyRelationships: null,
    isNewOrDirty() {
        return this.get('isNew') || Object.keys(this.changedAttributes()).length;
    },
    init() {
        this._super(...arguments);
        this.set('_dirtyRelationships', Ember.Object.create({}));
    },
    /**
     * Looks up relationship on model and returns hasManyRelationship
     * or belongsToRelationship object.
     *
     * @method resolveRelationship
     * @private
     * @param {String} rel Name of the relationship on the model
     **/
    resolveRelationship(rel) {
        var relation;
        var meta = this[rel].meta();
        if (meta.kind === 'hasMany') {
            relation = this.hasMany(rel).hasManyRelationship;
        } else if (meta.kind === 'belongsTo') {
            relation = this.belongsTo(rel).belongsToRelationship;
        }
        return relation;
    },
    save(options = {
        adapterOptions: {}
    }) {
        if (options.adapterOptions.nested) {
            return this._super(...arguments);
        }

        this.set('_dirtyRelationships', {});
        this.eachRelationship((rel) => {
            var relation = this.resolveRelationship(rel);
            if (relation.hasData) {
                var canonicalIds = relation.canonicalMembers.list.map(member => member.getRecord().get('id'));
                var currentIds = relation.members.list.map(member => member.getRecord().get('id'));
                var changes = {
                    create: relation.members.list.filter(m => m.getRecord().get('isNew')),
                    add: relation.members.list.filter(m => !m.getRecord().get('isNew') && canonicalIds.indexOf(m.getRecord().get('id')) === -1),
                    remove: relation.canonicalMembers.list.filter(m => currentIds.indexOf(m.getRecord().get('id')) === -1)
                };

                var other = this.get(`_dirtyRelationships.${rel}`) || {};
                Ember.merge(other, changes);
                this.set(`_dirtyRelationships.${rel}`, other);
            }
        });
        return this._super(...arguments);
    },

    /*
     * Query a hasMany relationship with query params
     *
     * @method queryHasMany
     * @param {String} propertyName Name of a hasMany relationship on the model
     * @param {Object} queryParams A hash to be serialized into the query string of the request
     * @param {Object} [ajaxOptions] A hash of options to be passed to jQuery.ajax
     * @returns {ArrayPromiseProxy} Promise-like array proxy, resolves to the records fetched
     */
    queryHasMany(propertyName, queryParams, ajaxOptions) {
        const reference = this.hasMany(propertyName);
        const promise = new Ember.RSVP.Promise((resolve, reject) => {
            // HACK: ember-data discards/ignores the link if an object on the belongsTo side
            // came first. In that case, grab the link where we expect it from OSF's API
            const url = reference.link() || this.get(`links.relationships.${propertyName}.links.related.href`);
            if (!url) {
                reject(`Could not find a link for '${propertyName}' relationship`);
                return;
            }
            const options = Ember.merge({
                url,
                data: queryParams,
                headers: Ember.get(this.store.adapterFor(this.constructor.modelName), 'headers'),
            }, ajaxOptions);

            authenticatedAJAX(options).then(
                Ember.run.bind(this, this.__queryHasManyDone, resolve),
                reject
            );
        });

        const ArrayPromiseProxy = Ember.ArrayProxy.extend(Ember.PromiseProxyMixin);
        return ArrayPromiseProxy.create({ promise });
    },

    __queryHasManyDone(resolve, payload) {
        const store = this.get('store');
        store.pushPayload(payload);
        const records = payload.data.map(datum => store.peekRecord(datum.type, datum.id));
        records.meta = payload.meta;
        records.links = payload.links;
        resolve(records);
    },
});
