// This is a port from `@centerforopenscience/ember-osf-web/app/utils/transition-target-url.ts`
// Get the URL (path and query string) that the given transition will resolve to,
// using the given router.
export default function transitionTargetURL(transition) {
    const params = Object.values(transition.params).filter(
        param => Object.values(param).length
    );
    var url = transition.router.generate(
        transition.targetName,
        ...params,
        { queryParams: transition.queryParams }
    );
    return url;
}
