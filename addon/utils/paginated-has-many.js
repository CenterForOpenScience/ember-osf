import Ember from 'ember';
import DS from 'ember-data';

let PromiseProxy = Ember.ObjectProxy.extend(Ember.PromiseProxyMixin);

// TODO: Make mutable, handle adding/deleting objects...
let PaginatedSet = Ember.Object.extend(Ember.Enumerable, {
    model: null,
    key: null,

    init() {
        this.set('_cachedItems', Ember.A());
        this.getNextPage();
    },

    length: null,
    nextObject(index) {
        let cached = this.get('_cachedItems');
        let promise = null;
        if (index < cached.get('length')) {
            promise = Ember.RSVP.resolve(cached.objectAt(index));
        } else if (this.get('_pendingPromise')) {
            promise = this.get('_pendingPromise').then(() => {
                return this.nextObject(index);
            });
        } else if (index < this.get('length')) {
            promise = this.getNextPage().then(() => {
                return this.nextObject(index);
            });
        }

        if (promise) {
            return PromiseProxy.create({ promise });
        } else {
            return undefined;
        }
    },

    anyLoaded: Ember.computed.notEmpty('length'),
    allLoaded: Ember.computed('length', '_cachedItems.length', function() {
        return this.get('length') === this.get('_cachedItems.length');
    }),

    getNextPage() {
        let model = this.get('model');
        let key = this.get('key');
        let page = (this.get('_lastPage') || 0) + 1;
        let promise = model.query(key, { page }).then((newPage) => {
            this.get('_cachedItems').addObjects(newPage);
            this.setProperties({
                'length': newPage.meta.pagination.total,
                '_lastPageResult': newPage,
                '_lastPage': page,
                '_pendingPromise': null
            });
            return newPage;
        });
        return this.set('_pendingPromise', promise);
    },

    _cachedItems: null,
    _lastPage: null,
    _lastPageIndex: null,
    _pendingPromise: null
});

function paginatedSetAttr(key) {
    return `__${key}_paginatedSet`;
}

export default function paginatedHasMany() {
    let hasMany = DS.hasMany(...arguments);

    return Ember.computed({
        get(key) {
            let model = this;
            let paginatedSet = this.get(paginatedSetAttr(key));
            if (!paginatedSet) {
                paginatedSet = PaginatedSet.create({
                    model,
                    key,
                    nextPage() {
                        return DS.PromiseArray.create({
                            promise: this.getNextPage()
                        });
                    },
                    reload() {
                        return hasMany.reload.call(model);
                    }
                });
                this.set(paginatedSetAttr(key), paginatedSet);
            }
            return paginatedSet;
        },
        set(/*key, value*/) {
            /*
            clearAttrs(this, key);
            //let attr = loadedItemsAttr(key);
            //this.set(attr, value);
            return hasMany._setter.call(this, ...arguments);
            */
        }
    }).meta(hasMany.meta());
}
