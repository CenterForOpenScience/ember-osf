import { singularize, pluralize } from 'ember-inflector';

function capitalize(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function preprintWord() {
    const entries = ['document', 'paper', 'preprint', 'thesis'];
    const wordDict = {};

    for (let i = 0; i < entries.length; i++) {
        wordDict[entries[i]] = {
            plural: pluralize(entries[i]),
            pluralCapitalized: pluralize(capitalize(entries[i])),
            singular: singularize(entries[i]),
            singularCapitalized: capitalize(entries[i]),
        };
        wordDict['none'] = {
            plural: '',
            pluralCapitalized: '',
            singular: '',
            singularCapitalized: '',
        };
    }

    return wordDict;
}
