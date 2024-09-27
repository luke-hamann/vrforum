import pkg from 'nunjucks';
const { render } = pkg;
import Topic from '../../models/topic.js';

/**
 * @param {Topic} topic
 * @returns {width: number, height: number}
 */
function topic_dimensions(topic) {
    return {
        width: (2 * (topic.get_thread_count() + 2)),
        height: (2 * (topic.get_longest_thread_length() + 2))
    };
}

/**
 * @param {Topic[]} topics
 * @returns {string}
 */
function build_strip(topics) {
    var output = '';
    var offset = 0;
    for (var topic of topics) {
        output += `
            <a-entity class="topic" position="${offset} 0 0">
                ${render_topic(topic)}
            </a-entity>
        `;
        offset += topic_dimensions(topic).width + 2;
    }

    return output;
}

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
    var left_strip = build_strip(left_topics);
    var right_strip = build_strip(right_topics);

    // Determine how far the right strip needs to be moved out further
    var offset = 0;
    for (let topic of right_topics) {
        // Account for each topic area width
        offset -= topic_dimensions(topic).width;
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

/**
 * @param {Topic} topic 
 * @return {string}
 */
function render_topic(topic) {
    const { width, height } = topic_dimensions(topic);

    var output = render('./views/stripmall/topic.html', {topic, width, height});

    // Render threads
    var x_offset = 1;
    for (var thread of topic.threads) {
        output += `
            <a-entity position="${x_offset} 0 -1">
                ${render('./views/stripmall/thread.html', {thread})}
            </a-entity>
        `;
        x_offset += 2;
    }

    // Render post form
    output += `
        <a-entity position="${x_offset} 0 -1">
            ${render('./views/stripmall/form.html', {
                form_title: 'New Post', title_field: true})}
        </a-entity>
    `

    return output;
}
