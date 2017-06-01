/*
Automatically expose translations for addon in a way that can be merged in with app
    https://github.com/jamesarosen/ember-i18n/issues/255
 */
import en from 'ember-osf/locales/en/translations';

export function initialize(appInstance) {
    const i18n = appInstance.lookup('service:i18n');
    i18n.addTranslations('en', en);
}

export default {
    name: 'ember-osf',
    initialize
};
