import pkg from 'nunjucks';
const { render } = pkg;
import Topic from '../../models/topic.js';

/**
 * @returns {string}
 */
export function page_full(topics) {
    return render('./views/stripmall/index.html', {
        content: page_fragment(topics)
    });
}

/**
 * @param {Topic[]} topics
 * @returns string
 */
export function page_fragment(topics) {
    return render('./views/stripmall/stripmall.html', { topics });

    // Split the topics into two groups
    var left_topics = [];
    var right_topics = [];
    var toggle = true;
    for (var topic of topics) {
        if (toggle) left_topics.push(topic);
        else        right_topics.push(topic);
        toggle = !toggle;
    }

    right_topics.reverse();

    // Build each group
    var left_strip = render('./views/stripmall/strip.html', {
        topics: left_topics
    });
    var right_strip = render('./views/stripmall/strip.html', {
        topics: right_topics
    })

    // Determine how far the right strip needs to be moved out further
    var offset = 0;
    for (let topic of right_topics) {
        // Account for each topic area width
        offset -= 2 * (topic.threads.length + 2);
    }
    //Account for spacing between topic areas
    offset -= 2 * (right_topics.length - 1);

    // Combine the groups
    var scene = `
        <a-entity position="-10 0 -10" rotation="0 90 0">
            ${left_strip}
        </a-entity>
        <a-entity position="10 0 ${offset - 10}" rotation="0 -90 0">
            ${right_strip}
        </a-entity>
    `;

    return scene;
}
