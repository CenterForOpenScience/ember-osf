import FactoryGuy from 'ember-data-factory-guy';
import faker from 'faker';

FactoryGuy.define('node', {
    default: {
        title: FactoryGuy.generate(() => faker.lorem.words(4)),
        description: FactoryGuy.generate(() => faker.lorem.paragraphs(2, '\n')),

        category: FactoryGuy.generate(() => faker.random.arrayElement(
            [
                'analysis', 'communication', 'data', 'hypothesis',
                'instrumentation', 'methods and measures', 'procedure', 'project',
                'software', 'other', ''
            ]
        )),

        currentUserPermissions: FactoryGuy.generate(() => faker.random.arrayElement(['read', 'write', 'admin'])),

        fork: false,
        collection: false,
        registration: false,
        public: FactoryGuy.generate(() => faker.random.boolean()),

        dateCreated: FactoryGuy.generate(() => faker.date.past(1)),
        dateModified: FactoryGuy.generate(() => faker.date.recent(1)),
    },
    traits: {
        hasChildren: {  // Has one layer of child projects
            children: FactoryGuy.generate(() => FactoryGuy.hasMany('node', 3))
        },
        hasInstitution: {
            affiliatedInstitutions: FactoryGuy.generate(() => FactoryGuy.hasMany('institution', 1))
        },
        hasComments: {
            comments: FactoryGuy.generate(() => FactoryGuy.hasMany('comment', 3))
        },
        hasContributors: {
            contributors: FactoryGuy.generate(() => FactoryGuy.hasMany('contributor', 3))
        },
        hasFiles: {
            // TOOD: Verify usage of trait in factory; it's not well documented
            files: FactoryGuy.generate(() => FactoryGuy.hasMany('file-provider', 3, 'hasFiles'))
        },
        hasRegistrations: {
            registrations: FactoryGuy.generate(() => FactoryGuy.hasMany('registration', 1))
        },
        hasLogs: {
            logs: FactoryGuy.generate(() => FactoryGuy.hasMany('log', 5))
        }
    }
});
