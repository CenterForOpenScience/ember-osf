import Ember from 'ember';
import layout from './template';

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
    didReceiveAttrs() {
        if (!this.get('licenses')) {
            this.get('store').query('license', { 'page[size]': 20 }).then(ret => {
                this.set('licensesAvailable', ret);
            });
        } else {
            this.set('licensesAvailable', this.get('licenses'));
        }
        if (!this.get('currentValues.year')) {
            let date = new Date();
            this.set('year', String(date.getUTCFullYear()));
        } else {
            this.set('year', this.get('currentValues.year'));
        }
        if (this.get('currentValues.copyrightHolders')) {
            this.set('copyrightHolders', this.get('currentValues.copyrightHolders'));
        }
    },
    _setNodeLicense: Ember.observer('licensesAvailable', 'currentValues.licenseType', function() {
        if (!this.get('currentValues.licenseType.id')) { //if not resolved properly
            this.set('nodeLicense', this.get('licensesAvailable.firstObject'));
        } else {
            this.set('nodeLicense', this.get('currentValues.licenseType'));
        }
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
        Ember.run.debounce(this, function() {
            if (this.get('autosave')) {
                this.get('actions.save').bind(this)();
            }
        }, 250);
    }),
    year: null,
    copyrightHolders: null,
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
