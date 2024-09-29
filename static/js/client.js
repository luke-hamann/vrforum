import HeadsUpDisplay from './headsupdisplay.js';

/**
 * @param {Map} post
 */
async function submitPost(post) {
    var topicIds = new Map(Array(...document.querySelectorAll('[data-type=topic]')).map((elm) => [elm.getAttribute('data-name'), elm.getAttribute('data-id')]));

    var action = 'post';
    var topic_id = topicIds.get(post.get('topic'));
    var title = post.get('title');
    var body = post.get('body');
    var payload = { action, topic_id, title, body };
    var response = await fetch(window.location.origin, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    var text = await response.text();

    return text;
}

AFRAME.registerComponent('player', {
    schema: {},
    init: function () {
        const scene = document.querySelector('.scene');
        const hud = new HeadsUpDisplay();
        const toggleHud = () => {
            this.el.toggleAttribute('wasd-controls');
            hud.toggleVisible();
        };

        hud.hide();
        this.el.appendChild(hud.getElement());

        window.addEventListener('keydown', async (event) => {
            // If the user toggles the hud
            if (event.key == 'Enter' && event.shiftKey) {
                toggleHud();
                return;
            }

            if (!hud.isVisible()) return;
            event.preventDefault();
            var result = hud.processKeyDownEvent(event);

            if (result instanceof Map) {
                var text = await submitPost(result);
                scene.innerHTML = text;
                hud.reset();
                toggleHud();
            }
        });
    }
});

// Prompt-based posting and replying

async function form() {
    var action, topic_id, post_id, title, body, payload;

    action = window.prompt('Action?');
    if (action != 'post' && action != 'reply') return;

    if (action == 'post') {
        topic_id = Number(window.prompt('Topic id?'));
        title = window.prompt('Title?');
        body = window.prompt('Body?');
        payload = { action, topic_id, title, body };
    } else {
        post_id = window.prompt('Post id?');
        body = window.prompt('Body?');
        payload = { action, post_id, body };
    }

    var response = await fetch(window.location.origin, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    var text = await response.text();

    return text;
}

//const player = document.querySelector('.player');
const scene = document.querySelector('.scene');
window.addEventListener('keydown', async (event) => {
    if (event.key == 'Enter' && event.ctrlKey) {
        //player.toggleAttribute('wasd-controls');
        var text = await form();
        scene.innerHTML = text;
    }
});
