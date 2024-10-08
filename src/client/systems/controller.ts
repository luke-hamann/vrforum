'use strict';

enum CurrentPage {
    Topics,
    Topic
}

AFRAME.registerSystem('controller', {
    _current_page: CurrentPage.Topics,
    _current_topic_id: -1,
    _player: document.querySelector('[camera]'),
    _scene: document.querySelector('.scene'),
    _topics: new Map(),
    _locked: false,

    init: async function() {
        // Identify the current page and set the state accordingly
        var pathname = window.location.pathname;
        if (pathname == '/') {
            this._current_page = CurrentPage.Topics;
            this._current_topic_id = -1;
        } else {
            const re = /^\/topic\/(\d+)\/$/;
            var match = pathname.match(re);
            if (match !== null) {
                this._current_page = CurrentPage.Topic;
                this._current_topic_id = Number(match[1]);
            }
        }

        // Get the topic houses (containing their coordinates)
        var source = document;
        if (this._current_page == CurrentPage.Topic) {
            var parser = new DOMParser();
            var response = await fetch('/', {headers: {'Refresh': ''}});
            var text = await response.text();
            source = parser.parseFromString(text, 'text/html');
        }

        // Map the topic ids to their coordinates
        var topic_elements = [...source.querySelectorAll('[topic-id]')];
        for (var elm of topic_elements) {
            var topic_id = Number(elm.getAttribute('topic-id'));
            var x = Number(elm.getAttribute('absolute-x'));
            var z = Number(elm.getAttribute('absolute-z'));
            this._topics.set(topic_id, { x, z });
        }

        // Reload the page when the user clicks the back button
        window.addEventListener("popstate", (event) => {
            window.location.reload();
        });
    },

    _getPlayerPosition: function(): {x: number, z: number} {
        // Get the x and z coordinates of the player
        return {
            x: (this._player as any).object3D.position.x as number,
            z: (this._player as any).object3D.position.z as number
        };
    },

    tick: function() {
        if (this._locked) return;

        if (this._current_page == CurrentPage.Topics) {
            var player_pos = this._getPlayerPosition();

            if (player_pos.z > -10 || player_pos.z < -11) return;

            this._current_topic_id = -1;
            for (var [topic_id, topic_pos] of this._topics) {
                if (Math.abs(player_pos.x - topic_pos.x) < 1) {
                    this._current_topic_id = topic_id;
                    break;
                }
            }

            if (this._current_topic_id < 0) return;

            this._locked = true;
            var url = `/topic/${this._current_topic_id}/`;
            fetch(url, {
                headers: { 'Refresh': '' }
            })
            .then((response) => response.text())
            .then((text) => {
                this._scene.innerHTML = text;
                this._current_page = CurrentPage.Topic;

                window.history.pushState(undefined, "", url);

                this._player.object3D.position.x = 0;
                this._player.object3D.position.z = 0;

                this._locked = false;
            })
        } else if (this._current_page == CurrentPage.Topic) {
            if (this._getPlayerPosition().z <= 0) return;

            this._locked = true;
            var url = '/';
            fetch(url, { headers: { 'Refresh': '' }})
            .then((response) => response.text())
            .then((text) => {
                this._scene.innerHTML = text;
                this._current_page = CurrentPage.Topics;

                window.history.pushState(undefined, '', url);
                
                var topic = this._topics.get(this._current_topic_id);
                this._player.object3D.position.x = topic.x;
                this._player.object3D.position.z = topic.z;

                this._locked = false;
            });
        }
    }
});
