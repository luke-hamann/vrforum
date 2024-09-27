import Reply from '../models/reply.js';
import Post from '../models/post.js';
import Thread from '../models/thread.js';
import Topic from '../models/topic.js';
import World from '../models/world.js';

/**
 * 
 * @param {Topic} topic
 * @returns {width: number, height: number}
 */
function topic_dimensions(topic) {
    return {
        width: (2 * (topic.get_thread_count() + 2)),
        height: (2 * (topic.get_longest_thread_length() + 2))
    };
}

function build_strip(topics) {
    var output = '';
    var offset = 0;
    for (var topic of topics) {
        output += `
            <a-entity class="topic" position="${offset} 0 ">
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
    return `
    <!DOCTYPE html>
    <html lang="en-us">
    <head>
        <meta charset="utf-8" />
        <title>VR Forum</title>
        <script src="/lib/aframe.min.js"></script>
        <script src="/js/client.js"></script>
    </head>
    <body>
        <a-scene>
            <a-entity
                class="player"
                camera
                look-controls="pointerLockEnabled: true;"
                wasd-controls
                position="0 1.6 0"
                ></a-entity>
            <a-sky color="#87CEEB"></a-sky>
            <a-plane
                color="#90ee90"
                height="1000"
                width="1000"
                position="0 -0.1 0"
                rotation="-90 0 0"
                ></a-plane>
            <a-plane
                color="#a9a9a9"
                height="1000"
                width="10"
                rotation="-90 0 0"
                ></a-plane>
            <a-entity class="scene">
                ${page_fragment(topics)}
            </a-entity>
        </a-scene>
    </body>
    </html>
`;
}

/**
 * @param {World} world
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
 * @param {string} form_title
 * @param {boolean} title_field_enabled
 * @return {string}
 */
function build_form(form_title, title_field_enabled) {
    // Form title
    var output = `
        <a-entity
            position="0 2 0"
            text="
                color: black;
                anchor: left;
                width: 5;
                value: ${form_title};
            "></a-entity>
    `

    // Post title field
    if (title_field_enabled) {
        output += `
        <a-entity
            position="0 1.8 0"
            text="
                color: black;
                anchor: left;
                value: Title;
            "></a-entity>
        <a-plane
            position="0.5 1.7 0"
            color="#FFF"
            height=0.1
            width=1
            ></a-plane>
        `
    }

    // Post/reply body field
    var body_label_y = (title_field_enabled ? 1.5 : 1.8);
    var body_textarea_y = (title_field_enabled ? 1.1 : 1.4);

    output += `
        <a-entity
            position="0 ${body_label_y} 0"
            text="
                color: black;
                anchor: left;
                value: Body;
            "></a-entity>
        <a-plane
            position="0.5 ${body_textarea_y} 0"
            color="#FFF"
            height=0.6
            width=1
            ></a-plane>
    `;

    return output;
}

/**
 * @param {Reply} reply - The Reply to render
 * @return {string}
 */
function render_reply(reply) {
    return `
        <a-entity
            position="0 1.8 0"
            text="
                color: black;
                anchor: left;
                width: 2;
                value: ${reply.date_time.toUTCString()};
            "></a-entity>
        <a-entity
            position="0 1.6 0"
            text="
                color: black;
                anchor: left;
                value: ${reply.body};
            "
            ></a-entity>
    `;
}

/**
 * @param {Post} post - The Post to render
 * @return {string}
 */
function render_post(post) {
    return `
        <a-entity
            position="0 2 0"
            text="
                color: black;
                anchor: left;
                width: 5;
                value: ${post.title};
            "></a-entity>
        <a-entity
            position="0 1.8 0"
            text="
                color: black;
                anchor: left;
                width: 2;
                value: ${post.date_time.toUTCString()};
            "></a-entity>
        <a-entity
            position="0 1.6 0"
            text="
                color: black;
                anchor: left;
                value: ${post.body};
            "
            ></a-entity>
    `;
}

/**
 * @param {Thread} thread
 * @return {string}
 */
function render_thread(thread) {
    var output = render_post(thread.post);

    var z_offset = -2;
    for (var reply of thread.replies) {
        output += `
            <a-entity position="0 0 ${z_offset}">
                ${render_reply(reply)}
            </a-entity>
        `;
        z_offset -= 2;
    }

    output += `
        <a-entity position="0 0 ${z_offset}">
            ${build_form('New Reply', false)}
        </a-entity>
    `;

    return output;
}

/**
 * @param {Topic} topic 
 * @return {string}
 */
function render_topic(topic) {
    // Create header text
    var output = `
        <a-entity
            position="0 3 0"
            text="
                color: black;
                anchor: left;
                width: 10;
                value: ${topic.name};
            "
        ></a-entity>
    `;

    // Create floor
    const {width, height} = topic_dimensions(topic);
    output += `
        <a-plane
            position="${width / 2} 0 ${height / -2}"
            height=${height}
            width=${width}
            rotation="-90 0 0"></a-plane>
    `;

    // Render threads
    var x_offset = 1;
    for (var thread of topic.threads) {
        output += `
            <a-entity position="${x_offset} 0 -1">
                ${render_thread(thread)}
            </a-entity>
        `;
        x_offset += 2;
    }

    // Render post form
    output += `
        <a-entity position="${x_offset} 0 -1">
            ${build_form('New Post', true)}
        </a-entity>
    `

    return output;
}
