'use strict';

// Constants for tracking which page the user is on
enum CurrentPage {
    Topics,
    Topic
}

AFRAME.registerSystem('teleporter', {
    _currentPage: CurrentPage.Topics,
    _currentTopicId: -1,
    _player: document.querySelector('[camera]'),
    _scene: document.querySelector('.scene'),
    _topics: new Map(),
    _isLocked: false,

    // Initialize the teleporter system
    init: async function() {
        // Identify the current page and set the state accordingly
        var pathname = window.location.pathname;
        if (pathname == '/') {
            this._currentPage = CurrentPage.Topics;
            this._currentTopicId = -1;
        } else {
            const re = /^\/topic\/(\d+)\/$/;
            var match = pathname.match(re);
            if (match !== null) {
                this._currentPage = CurrentPage.Topic;
                this._currentTopicId = Number(match[1]);
            }
        }

        // If the user is on the Topics page, we already have the coordinates of the topic houses
        var source = document;

        // If the user is on a Topic page, we need to fetch the Topics page to get the coordinates
        // of the topic houses
        if (this._currentPage == CurrentPage.Topic) {
            var parser = new DOMParser();
            var response = await fetch('/', {headers: {'Refresh': ''}});
            var text = await response.text();
            source = parser.parseFromString(text, 'text/html');
        }

        // Generate of map linking topic ids to their coordinates
        var topic_elements = [...source.querySelectorAll('[topic-id]')];
        for (var elm of topic_elements) {
            var topic_id = Number(elm.getAttribute('topic-id'));
            var x = Number(elm.getAttribute('absolute-x'));
            var z = Number(elm.getAttribute('absolute-z'));
            this._topics.set(topic_id, { x, z });
        }

        // Reload the page when the user clicks the back button
        window.addEventListener("popstate", () => {
            window.location.reload();
        });
    },

    // Get the x and z coordinates of the player
    _getPlayerPosition: function(): {x: number, z: number} {
        return {
            x: (this._player as any).object3D.position.x as number,
            z: (this._player as any).object3D.position.z as number
        };
    },

    // Watch for inter-page navigation based on the player's position
    tick: function() {
        // When a page is being navigated to, prevent that page from being requested multiple times
        if (this._isLocked) return;

        // If the user may be teleporting from the Topics page to an individual Topic
        if (this._currentPage == CurrentPage.Topics) {
            var player_pos = this._getPlayerPosition();

            // Determine if the player is deep enough on the z-axis to be at the topic houses
            if (player_pos.z > -10 || player_pos.z < -11) return;

            // Determine if the player is close enough to a given topic door
            this._currentTopicId = -1;
            for (var [topic_id, topic_pos] of this._topics) {
                if (Math.abs(player_pos.x - topic_pos.x) < 1) {
                    this._currentTopicId = topic_id;
                    break;
                }
            }

            if (this._currentTopicId < 0) return;

            this._isLocked = true;

            // Request the selected topic page
            var url = `/topic/${this._currentTopicId}/`;
            fetch(url, { headers: { 'Refresh': '' }})
            .then((response) => response.text())
            .then((text) => {
                this._scene.innerHTML = text;
                this._currentPage = CurrentPage.Topic;

                window.history.pushState(undefined, "", url);

                this._player.object3D.position.x = 0;
                this._player.object3D.position.z = 0;

                this._isLocked = false;
            })

        // If the user may be teleporting from a Topic page to the Topics page
        } else if (this._currentPage == CurrentPage.Topic) {
            if (this._getPlayerPosition().z <= 0) return;

            this._isLocked = true;

            // Request the topics page
            var url = '/';
            fetch(url, { headers: { 'Refresh': '' }})
            .then((response) => response.text())
            .then((text) => {
                this._scene.innerHTML = text;
                this._currentPage = CurrentPage.Topics;

                window.history.pushState(undefined, '', url);
                
                var topic = this._topics.get(this._currentTopicId);
                this._player.object3D.position.x = topic.x;
                this._player.object3D.position.z = topic.z;

                this._isLocked = false;
            });
        }
    }
});
