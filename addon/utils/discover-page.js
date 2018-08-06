import Ember from 'ember';
import config from 'ember-get-config';

/**
 * @module ember-osf
 * @submodule utils
 */

/**
 * @class discover-page
 */

const MAX_SOURCES = 500;
const elasticAggregations = {
    sources: {
        terms: {
            field: 'sources',
            size: MAX_SOURCES,
        },
    },
};

/**
 *  For services where portion of query is restricted.
 *  Builds the locked portion of the query.
 *  For example, in preprints, types=['preprint', 'thesis']
 *  is something that cannot be modified by the user.
 *
 *  @method buildLockedQueryBody
 *  @param {Object} lockedParams - Locked param keys matched to the locked value.
 *  @return {List} queryBody - locked portion of query body
*/
function buildLockedQueryBody(lockedParams) {
    const queryBody = [];
    Object.keys(lockedParams).forEach((key) => {
        const query = {};
        let queryKey = [`${key}`];
        if (key === 'tags') {
            queryKey = key;
        } else if (key === 'contributors') {
            queryKey = 'lists.contributors.name';
        }
        query[queryKey] = lockedParams[key];
        if (key === 'bool') {
            queryBody.push(query);
        } else {
            queryBody.push({
                terms: query,
            });
        }
    });
    return queryBody;
}

/**
 *  Construct queryBody for OSF facets
 *
 *  @method buildQueryBody
 *  @param {Object} queryParams - Ember Parachute queryParams
 *  @param {List} filters - Filters for query body
 *  @param {Boolean} queryParamsChanged - Whether or not any queryParams differ from their defaults
 *  @return {String} queryBody - Stringified queryBody
*/
function buildQueryBody(queryParams, filters, queryParamsChanged) {
    let query = {
        query_string: {
            query: queryParams.q || '*',
        },
    };

    if (filters.length) {
        query = {
            bool: {
                must: query,
                filter: filters,
            },
        };
    }

    const queryBody = {
        query,
        from: (queryParams.page - 1) * queryParams.size,
        aggregations: elasticAggregations,
    };

    let sortValue = queryParams.sort;
    if (!queryParamsChanged) {
        sortValue = '-date_modified';
    }

    if (sortValue) {
        const sortBy = {};
        sortBy[sortValue.replace(/^-/, '')] = sortValue[0] === '-' ? 'desc' : 'asc';
        queryBody.sort = sortBy;
    }

    return JSON.stringify(queryBody);
}

/**
 *  Construct filters for OSF facets (e.g., providers, subjects, etc.)
 *
 *  @method constructBasicFilters
 *  @param {Object} filterMap - Mapping from OSF params to SHARE params
 *  @param {List} filters - Filters for query body
 *  @param {Boolean} isProvider - theme.isProvider
 *  @param {Object} queryParams - Ember Parachute queryParams
 *  @return {List} filters - Filters for query body
*/
function constructBasicFilters(filterMap, filters, isProvider, queryParams) {
    Object.keys(filterMap).forEach((key) => {
        const val = filterMap[key];
        const filterList = queryParams[key];

        if (!filterList.length || (key === 'provider' && isProvider)) {
            return;
        }

        if (val === 'subjects') {
            const matched = [];
            for (const filter of filterList) {
                matched.push({
                    match: {
                        [val]: filter,
                    },
                });
            }

            filters.push({
                bool: {
                    should: matched,
                },
            });
        } else {
            filters.push({
                terms: {
                    [val]: filterList,
                },
            });
        }
    });

    return filters;
}

/**
 * Sort contributors by order cited and set bibliographic property
 *
 * @private
 * @method sortContributors
 * @param {List} contributors - list.contributors from a SHARE ES result
 * @return {List}
 */
function sortContributors(contributors) {
    return contributors
        .sort((b, a) => (b.order_cited || -1) - (a.order_cited || -1))
        .map(contributor => ({
            users: Object.keys(contributor).reduce(
                (acc, key) => Ember.assign(acc, { [Ember.String.camelize(key)]: contributor[key] }),
                { bibliographic: contributor.relation !== 'contributor' }
            )
        }));
}

/**
 * Make share data look like apiv2 preprints data and pull out identifiers
 *
 * @private
 * @method transformShareData
 * @param {Object} result - hit from a SHARE ES
 * @return {Object}
 */
function transformShareData(result) {
    const transformedResult = Ember.assign(result._source, {
        id: result._id,
        type: 'elastic-search-result',
        workType: result._source['@type'],
        abstract: result._source.description,
        subjects: result._source.subjects.map(each => ({ text: each })),
        subject_synonyms: result._source.subject_synonyms.map(each => ({ text: each })),
        providers: result._source.sources.map(item => ({
            name: item,
        })),
        hyperLinks: [ // Links that are hyperlinks from hit._source.lists.links
            {
                type: 'share',
                url: `${config.OSF.shareBaseUrl}${result._source.type.replace(/ /g, '')}/${result._id}`,
            },
        ],
        infoLinks: [], // Links that are not hyperlinks  hit._source.lists.links
        registrationType: result._source.registration_type, // for registries
    });

    result._source.identifiers.forEach(function(identifier) {
        if (identifier.startsWith('http://')) {
            transformedResult.hyperLinks.push({ url: identifier });
        } else {
            const spl = identifier.split('://');
            const [type, uri] = spl;
            transformedResult.infoLinks.push({ type, uri });
        }
    });

    transformedResult.contributors = transformedResult.lists.contributors ?
        sortContributors(transformedResult.lists.contributors) :
        [];

    // Temporary fix to handle half way migrated SHARE ES
    // Only false will result in a false here.
    transformedResult.contributors.map((contributor) => {
        const contrib = contributor;
        contrib.users.bibliographic = !(contributor.users.bibliographic === false);
        return contrib;
    });

    return transformedResult;
}

export {
    sortContributors,
    transformShareData,
    buildLockedQueryBody,
    constructBasicFilters,
    buildQueryBody,
};
