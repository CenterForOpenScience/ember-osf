/*
Automatically expose translations for addon in a way that can be merged in with app
    https://github.com/jamesarosen/ember-i18n/issues/255
 */
import Ember from 'ember';
import en from 'ember-osf/locales/en/translations';

export function initialize(appInstance) {
    const i18n = appInstance.lookup('service:i18n');
    i18n.reopen({
        theme: Ember.inject.service(),
        t(_, data) {
            let translations = this.get('_locale.translations');
            let preprintWord = this.get('theme.provider.preprintWord') || 'preprint';
            data = data || {};
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
