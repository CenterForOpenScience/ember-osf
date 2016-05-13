import {
    Factory,
    faker
} from 'ember-cli-mirage';

export default Factory.extend({
    givenName: faker.name.firstName,
    middleNames: faker.name.firstName,
    familyName: faker.name.lastName,
    fullName: function() {
        return `${this.givenName} ${this.middleNames} ${this.familyName}`;
    },
    dateRegistered: faker.date.past
});
