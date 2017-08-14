/*
Automatically expose translations for addon in a way that can be merged in with app
    https://github.com/jamesarosen/ember-i18n/issues/255
 */
import Ember from 'ember';
import en from 'ember-osf/locales/en/translations';
import tHelper from 'ember-i18n/helper';

export function initialize(appInstance) {
    tHelper.reopen({
        theme: Ember.inject.service(),
        compute(_, data) {
            data = data || {};
            let translations = this.get('i18n._locale.translations');
            let preprintWord = this.get('theme.provider.preprintWord');
            let getTerms = () => ({
                preprint: translations[`preprintWords.${preprintWord}.preprint`],
                preprints: translations[`preprintWords.${preprintWord}.preprints`],
                Preprint: translations[`preprintWords.${preprintWord}.Preprint`],
                Preprints: translations[`preprintWords.${preprintWord}.Preprints`]
            });
            if (!preprintWord) {
                this.get('theme.provider').then(provider => {
                    preprintWord = provider.get('preprintWord') || 'preprint';
                    data.preprintWords = getTerms();
                    this.recompute();
                });
                return null;
            }
            data.preprintWords = getTerms();
            return this._super(_, data, true);
        }
    });
    const i18n = appInstance.lookup('service:i18n');
    i18n.reopen({
        theme: Ember.inject.service(),
        store: Ember.inject.service(),
        t(_, data, skip) {
            data = data || {};
            if (typeof data.preprintWords !== 'undefined' || skip) {
                return this._super(_, data);
            }
            let translations = this.get('_locale.translations');
            let providerId = this.get('theme.id');
            let provider = this.get('store').peekRecord('preprint-provider', providerId);
            let preprintWord = 'default';
            if (provider) {
                preprintWord = provider.get('preprintWord');
            }
            data.preprintWords = {
                preprint: translations[`preprintWords.${preprintWord}.preprint`],
                preprints: translations[`preprintWords.${preprintWord}.preprints`],
                Preprint: translations[`preprintWords.${preprintWord}.Preprint`],
                Preprints: translations[`preprintWords.${preprintWord}.Preprints`]
            };
            return this._super(_, data);
        }
    });
    i18n.addTranslations('en', en);
}

export default {
    name: 'ember-osf',
    initialize
};
