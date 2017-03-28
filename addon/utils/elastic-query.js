import Ember from 'ember';
import moment from 'moment';

/*
 * @function dateRangeFilter
 * @param String field Name of the date field to filter
 * @param Object start Beginning of date range
 * @param Object end End of date range
 */
function dateRangeFilter(field, start, end) {
    if (start && end) {
        let filter = { range: {} };
        filter.range[field] = {
            gte: moment(start).format(),
            lte: moment(end).format()
        };
        return filter;
    } else {
        return null;
    }
}

/*
 * @function termsFilter
 * @param String field Name of the field to filter
 * @param Array terms List of terms to match
 * @param Boolean [all] If true (default), return an array of filters to match results with *all* of the terms. Otherwise, return a single filter to match results with *any* of the terms.
 */
function termsFilter(field, terms, all = true) {
    if (terms && terms.length) {
        if (['contributors', 'funders', 'identifiers', 'tags', 'publishers'].includes(field)) {
            field = field + '.exact';
        }
        if (all) {
            return terms.map(term => {
                let filter = { term: {} };
                // creative work filter should not include subtypes
                if (term === 'creative work' && field === 'types') {
                    filter.term.type = term;
                } else {
                    filter.term[field] = term;
                }
                return filter;
            });
        } else {
            let filter = { terms: {} };
            filter.terms[field] = terms;
            return filter;
        }
    } else {
        return null;
    }
}

function uniqueFilter(value, index, self) {
    return self.indexOf(value) === index;
}

function getUniqueList(data) {
    return data.filter(uniqueFilter);
}

function encodeParams(tags) {
    return tags.map(tag => tag.replace(/,/g, ',\\'));
}

function decodeParams(param) {
    return param.split(/,(?!\\)/).map(function(tag) {
        return tag.replace(/,\\/g, ',');
    });
}

function getSplitParams(params) {
    if (!params.length) {
        return params.slice(0);
    } else if (params.length && Ember.$.isArray(params[0])) {
        return params[0];
    } else if (params.length && typeof (params) === 'string') {
        return decodeParams(params);
    } else if (params.length === 1) {
        return decodeParams(params[0]);
    }
    return params;
}

export {
    dateRangeFilter,
    termsFilter,
    getUniqueList,
    encodeParams,
    decodeParams,
    getSplitParams
};
