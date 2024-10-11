'use strict';

// Constants for tracking which page the user is on
enum CurrentPage {
    Topics,
    Topic
}

// An interface for describing a position
interface Position {
    x: number,
    z: number
}

AFRAME.registerSystem('teleporter', {
    _current_page: CurrentPage.Topics,
    _current_topic_id: -1,
    _player: document.querySelector('[camera]'),
    _scene: document.querySelector('.scene'),
    _topic_positions: new Map<number, Position>(),
    _is_locked: false,

    // Initialize the teleporter system
    init: async function(): Promise<void> {
        // Identify the current page and set the state accordingly
        var pathname = window.location.pathname;
        if (pathname == '/') {
            this._current_page = CurrentPage.Topics;
            this._current_topic_id = -1;
        } else {
            const re = /^\/topic\/(\d+)\/$/;
            var match = pathname.match(re);
            if (match != null) {
                this._current_page = CurrentPage.Topic;
                this._current_topic_id = Number(match[1]);
            }
        }

        // If the user is on the topics page, we already have the coordinates of
        // the topic houses
        var source: Document = document;

        // If the user is on a topic page, we need to fetch the topics page to
        // get the coordinates of the topic houses
        if (this._current_page == CurrentPage.Topic) {
            var response = await fetch('/', { headers: { 'Refresh': '' } });
            var text = await response.text();
            var parser = new DOMParser();
            source = parser.parseFromString(text, 'text/html');
        }

        // Generate a map to link topic ids with the coordinates of their houses
        var topic_elements = [...source.querySelectorAll('[topic-id]')];
        for (var elm of topic_elements) {
            var topic_id = Number(elm.getAttribute('topic-id'));
            var x = Number(elm.getAttribute('absolute-x'));
            var z = Number(elm.getAttribute('absolute-z'));
            this._topic_positions.set(topic_id, { x, z });
        }

        // Reload the page when the user clicks the back button
        window.addEventListener("popstate", (): void => {
            window.location.reload();
        });
    },

    // Get the coordinates of the player
    _get_player_position: function(): Position {
        return {
            x: (this._player as any).object3D.position.x as number,
            z: (this._player as any).object3D.position.z as number
        };
    },

    // Watch for cross-page navigation based on the player's position
    tick: function(): void {
        // When a page is being navigated to, prevent multiple page requests
        if (this._is_locked) return;

        // If the user may be navigating to an individual topic
        if (this._current_page == CurrentPage.Topics) {
            var player_position: Position = this._get_player_position();

            // Determine if the player is deep enough on the z-axis to be at the
            // topic houses
            if (player_position.z > -10 || player_position.z < -11) return;

            // Determine if the player is close enough to a given topic door
            this._current_topic_id = -1;
            for (var [topic_id, topic_position] of this._topic_positions) {
                if (Math.abs(player_position.x - topic_position.x) < 1) {
                    this._current_topic_id = topic_id;
                    break;
                }
            }

            if (this._current_topic_id < 0) return;

            this._is_locked = true;

            // Request and transition to the selected topic page
            var url = `/topic/${this._current_topic_id}/`;
            fetch(url, { headers: { 'Refresh': '' }})
            .then((response) => response.text())
            .then((text) => {
                this._scene.innerHTML = text;
                this._current_page = CurrentPage.Topic;

                window.history.pushState(undefined, "", url);

                this._player.object3D.position.x = 0;
                this._player.object3D.position.z = 0;

                this._is_locked = false;
            });

        // If the user may be navigating to the topics page
        } else if (this._current_page == CurrentPage.Topic) {
            // Check if the user has not entered topic exit wall
            if (this._get_player_position().z <= 0) return;

            this._is_locked = true;

            // Request and transition to the topics page
            var url = '/';
            fetch(url, { headers: { 'Refresh': '' }})
            .then((response) => response.text())
            .then((text) => {
                this._scene.innerHTML = text;
                this._current_page = CurrentPage.Topics;

                window.history.pushState(undefined, '', url);
                
                var topic_position =
                    this._topic_positions.get(this._current_topic_id)!;
                this._player.object3D.position.x = topic_position.x;
                this._player.object3D.position.z = topic_position.z;

                this._is_locked = false;
            });
        }
    }
});
