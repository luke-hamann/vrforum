export function render_post(post) {
    var text = post.title + '\n\n' + post.body;

    return `
        <a-entity
            position="0 1.6 0"
            text="
            color: black; value: ${text};
        ">
        </a-entity>
        <a-entity
            position="0 1.6 -2"
            text="
            color: black; value: ${text};
        ">
        </a-entity>
        <a-entity
            position="0 1.6 -4"
            text="
            color: black; value: ${text};
        ">
        </a-entity>
        <a-entity
            position="0 1.6 -6"
            text="
            color: black; value: ${text};
        ">
        </a-entity>
    `
}
