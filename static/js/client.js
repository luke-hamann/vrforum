class TextBox {
    constructor(text, x, y, z) {
        this._elm = document.createElement('a-entity');
        this._elm.setAttribute('position', `${x} ${y} ${z}`);
        this.setText(text);
    }

    getElement() {
        return this._elm();
    }

    getText() {
        return this._text;
    }

    setText(text) {
        this._text = text;
        this._elm.setAttribute('text', {
            color: 'black',
            value: text
        })
    }

    appendText(text) {
        this.setText(this._text + text);
    }
}

class UserInterface {
    constructor() {
        this._elm = document.createElement('a-entity');

        this._backdrop = document.createElement('a-plane');
        this._backdrop.setAttribute('position', '-1 1 -2');
        this._backdrop.setAttribute('color', '#FFF');

        this._text = document.createElement('a-entity');
        this._text.setAttribute('position', '-1 1 -1.95');

        this._elm.appendChild(this._backdrop);
        this._elm.appendChild(this._text);

        this.viewPostMode();
    }

    getElement() {
        return this._elm;
    }

    show() {
        this._elm.setAttribute('visible', true);
    }

    hide() {
        this._elm.setAttribute('visible', false);
    }

    isVisible() {
        return this._elm.getAttribute('visible');
    }

    toggleVisible() {
        this._elm.setAttribute('visible', !this._elm.getAttribute('visible'));
    }

    _renderText(text) {
        this._text.setAttribute('text', {
            align: 'left',
            color: 'black',
            value: text
        });
    }

    getMode() {
        return this._mode;
    }

    toggleMode() {
        if (this._mode == 'post') {
            this.viewReplyMode();
        } else {
            this.viewPostMode();
        }
    }

    viewPostMode() {
        this._renderText('New Post');
        this._mode = 'post';
    }

    viewReplyMode() {
        this._renderText('New Reply');
        this._mode = 'reply';
    }
}

const CHARACTERS = '`1234567890-=~!@#$%^&*()_+qwertyuiop[]\\QWERTYUIOP{}|asdfghjkl;\'ASDFGHJKL:"zxcvbnm,./ZXCVBNM<>?'.split('');

AFRAME.registerComponent('player', {
    schema: {},
    init: function () {
        // Create user interface
        var ui = new UserInterface();
        ui.hide();
        this.el.appendChild(ui.getElement());

        window.addEventListener('keydown', (event) => {
            if (event.key == 'Enter' && event.shiftKey) {
                this.el.toggleAttribute('wasd-controls');
                ui.toggleVisible();
                return;
            }

            if (!ui.isVisible()) return;

            if (event.key == 'ArrowLeft' || event.key == 'ArrowRight') {
                ui.toggleMode();
                return;
            }

            if (!CHARACTERS.includes(event.key)) return;

            console.log(event.key);
        });
    }
});

// Prompt-based posting and replying

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
