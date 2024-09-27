async function form() {
    var action, topic_id, post_id, title, body;

    action = window.prompt('Action?');
    if (action != 'post' && action != 'reply') return;

    if (action == 'post') {
        topic_id = Number(window.prompt('Topic id?'));
        title = window.prompt('Title?');
        body = window.prompt('Body?');
        payload = {action, topic_id, title, body};
    } else {
        post_id = window.prompt('Post id?');
        body = window.prompt('Body?');
        payload = {action, post_id, body};
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

document.addEventListener('DOMContentLoaded', () => {
    //const player = document.querySelector('.player');
    const scene = document.querySelector('.scene');
    window.addEventListener('keydown', async (event) => {
        if (event.key == 'Enter' && event.ctrlKey) {
            //player.toggleAttribute('wasd-controls');
            var text = await form();
            scene.innerHTML = text;
        }
    });
});
