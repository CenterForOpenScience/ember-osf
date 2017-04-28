import Ember from 'ember';
import _ from 'lodash';
import layout from './template';

/**
* @module ember-osf
* @submodule components
*/

/**
* Widget to select a license on a project or preprint with the ability
* to only allow a subset of licenses and to autosave or save explictly
* ```handlebars
* {{license-picker
*   licenses=availableLicenses
*   currentValues=basicsLicense
*   showCategories=false
*   editLicense=(action 'editLicense')
*   allowDismiss=false
*   autosave=true
*   showBorder=false
*   pressSubmit=(action 'saveBasics')}}
* ```
* @class license-picker
* @param {DS.Model} licenses Which Licenses are available to be selected
* @param {Object} currentValues The values that are currently on the model, as strings (copyrightHolders joined as a string)
* @param {boolean} showCategories whether the licenses available in the dropdown are separated by categories
* @param {action} editLicense function to be called when the license details are changed (either on submit or autosaving)
* @param {boolean} autosave whether the component should call the save function on every change or offer an explicit save button
* @param {boolean} showBorder frame the widget in a border
* @param {action} pressSubmit what should be called if Enter is pressed
*/
export default Ember.Component.extend({
    layout,
    store: Ember.inject.service(),
    licensesAvailable: Ember.A(),
    showBorder: true,
    showYear: true,
    showText: false,
    toggleText: true,
    showCopyrightHolders: true,
    showCategories: true,
    allowDismiss: false,
    init() {
        this._super(...arguments);
        // Debouncing autosave prevents a request per keystroke, only sending it
        // when the user is done typing (trailing=true), debounce timer can be tweaked.
        this.set('debouncedAutosave', _.debounce(() => {
            if (this.get('autosave')) {
                this.get('actions.save').bind(this)();
            }
        }, 500, {trailing: true}));
    },
    didReceiveAttrs() {
        if (!this.get('currentValues.year') && !this.get('year')) {
            let date = new Date();
            this.set('year', String(date.getUTCFullYear()));
        }
        if (!this.get('licenses') && this.get('licensesAvailable').length === 0) {
            this.get('store').query('license', { 'page[size]': 20 }).then(ret => this.set('licensesAvailable', ret));
        } else if (this.get('licenses')) {
            this.set('licensesAvailable', this.get('licenses'));
        }
    },
    showOtherFields: Ember.observer('nodeLicense', 'nodeLicense.text', function() {
        let text = this.get('nodeLicense.text');
        if (!text) {
            return;
        }
        this.set('showYear', text.indexOf('{{year}}') !== -1);
        this.set('showCopyrightHolders', text.indexOf('{{copyrightHolders}}') !== -1);
    }),
    yearRequired: Ember.computed('nodeLicense', function() {
        return this.get('nodeLicense.requiredFields') && this.get('nodeLicense.requiredFields').indexOf('year') !== -1;
    }),
    copyrightHoldersRequired: Ember.computed('nodeLicense', function() {
        return this.get('nodeLicense.requiredFields') && this.get('nodeLicense.requiredFields').indexOf('copyrightHolders') !== -1;
    }),
    nodeLicense: Ember.computed('licensesAvailable', 'currentValues.licenseType', function() {
        if (this.get('currentValues.licenseType.id')) {
            return this.get('currentValues.licenseType');
        }
        return this.get('licensesAvailable.firstObject');
    }),
    year: Ember.computed('currentValues.year', function() {
        return this.get('currentValues.year');
    }),
    copyrightHolders: Ember.computed('currentValues.copyrightHolders', function() {
        return this.get('currentValues.copyrightHolders');
    }),
    nodeLicenseText: Ember.computed('nodeLicense', 'nodeLicense.text', 'year', 'copyrightHolders', function() {
        let text = this.get('nodeLicense.text');
        if (text) {
            text = text.replace(/({{year}})/g, this.get('year') || '');
            text = text.replace(/({{copyrightHolders}})/g, this.get('copyrightHolders') || '');
        }
        return text;
    }),
    licenseEdited: Ember.observer('copyrightHolders', 'nodeLicense', 'year', function() {
        if (
            (this.get('copyrightHolders') && (this.get('copyrightHolders') !== this.get('currentValues.copyrightHolders'))) ||
            (this.get('year') && (this.get('year') !== this.get('currentValues.year'))) ||
            (this.get('currentValues.licenseType.id') && this.get('nodeLicense.id') !== this.get('currentValues.licenseType.id'))
        ) {
            this.get('debouncedAutosave')();
        }
    }),
    actions: {
        selectLicense(license) {
            this.set('nodeLicense', license);
        },
        toggleFullText() {
            this.set('showText', !this.get('showText'));
        },
        save() {
            let values = {
                licenseType: this.get('nodeLicense'),
                year: this.get('year'),
                copyrightHolders: this.get('copyrightHolders') ? this.get('copyrightHolders') : ''
            };
            this.attrs.editLicense(
                values,
                !((this.get('yearRequired') && !values.year) || (this.get('copyrightHoldersRequired') && values.copyrightHolders.length === 0))
            );
        },
        sendSubmit() {
            this.sendAction('pressSubmit');
        },
        dismiss() {
            this.attrs.dismiss();
        }
    }
});
