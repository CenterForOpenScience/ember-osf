import Ember from 'ember';
import layout from './template';

import {
  validator, buildValidations
}
from 'ember-cp-validations';

const Validations = buildValidations({
    fullName: {
        description: 'Full Name',
        validators: [
            validator('presence', true),
            validator('length', {
                min: 3
            })
        ]
    },
    username: {
        validators: [
            validator('presence', true),
            validator('format', {
                type: 'email'
            })
       ]
    },
});

export default Ember.Component.extend(Validations, {
    layout,
    fullName: null,
    username: null,
    isFormValid: Ember.computed.alias('validations.isValid'),
    actions: {
        searchView() {
            this.sendAction('searchView');
        },
        addUnregisteredContributor(fullName, email) {
            this.sendAction('addUnregisteredContributor', fullName, email);

        }
    }
});
