import Ember from 'ember';

const { htmlSafe } = Ember.String;

/**
Render markdown text for selected rules.

 Usage example:
 ```handlebars
 This is the text we want to render: {{markdown-viewer '*text is italic*'}}
 ```

 @class markdown-viewer-helper
 @uses markdownit
 */
/* global markdownit */
export function markdownViewer(params) {

    const [markdown] = params;
    const html = markdownit('zero').enable(['list', 'newline', 'emphasis', 'paragraph', 'link']);
    const renderedHtml = html.render(markdown);

    return htmlSafe(renderedHtml);
}

export default Ember.Helper.helper(markdownViewer);
