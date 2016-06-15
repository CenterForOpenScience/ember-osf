import DS from 'ember-data';

import OsfModel from './osf-model';

export default OsfModel.extend({
    title: DS.attr('string'),
    description: DS.attr('string'),
    category: DS.attr('string'),

    currentUserPermissions: DS.attr('string'),

    fork: DS.attr('boolean'),
    collection: DS.attr('boolean'),
    registration: DS.attr('boolean'),
    public: DS.attr('boolean'),

    dateCreated: DS.attr('date'),
    dateModified: DS.attr('date'),

    tags: DS.attr(),

    templateFrom: DS.attr('string'),

    parent: DS.belongsTo('node', {
        inverse: 'children'
    }),
    children: DS.hasMany('nodes', {
        inverse: 'parent'
    }),
    affiliatedInstitutions: DS.hasMany('institutions', {
        inverse: 'nodes'
    }),
    comments: DS.hasMany('comments'),
    contributors: DS.hasMany('contributors', {
        updateRequest: {
            requestType: (snapshot, contributorsship) => {
                if (snapshot.hasMany(contributorsship).filter(each => each.record.get('isNew')).length) {
                    return 'POST';
                }
                return 'PATCH';
            },
            isBulk: () => true,
            serialized(serialized) {
                return {
                    data: serialized.map(function(record) {
                        var data = record.data;
                        return data;
                    })
                };
            }
        },
        inverse: null
    }),

    files: DS.hasMany('file-provider'),
    //forkedFrom: DS.belongsTo('node'),
    nodeLinks: DS.hasMany('node-links', {
        updateRequest: {
            requestType: () => 'POST',
            isBulk: () => true,
            serialized(serialized) {
                return {
                    data: serialized.map(function(record) {
                        var data = record.data;
                        return data;
                    })
                };
            }
        },
        inverse: null
    }),
    registrations: DS.hasMany('registrations', {
        inverse: 'registeredFrom'
    }),

    root: DS.belongsTo('node', {
        inverse: null
    }),
    logs: DS.hasMany('logs'),

    save() {
	// Some duplicate logic from osf-model#save needed to support
	// contributor edits being saved through the node
        var contributors = this.hasMany('contributors');
        if (contributors.hasData || contributors.hasLoaded) {
	    this.set(
		'_dirtyRelationships.contributors.update',
		contributors.members.filter(m => Object.key(m.record.changedAttributes()).length)
	    );
        }
	return this._super(...arguments);
    }
});
