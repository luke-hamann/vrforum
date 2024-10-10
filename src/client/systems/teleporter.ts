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
    _currentPage: CurrentPage.Topics,
    _currentTopicId: -1,
    _player: document.querySelector('[camera]'),
    _scene: document.querySelector('.scene'),
    _topicPositions: new Map<number, Position>(),
    _isLocked: false,

    // Initialize the teleporter system
    init: async function(): Promise<void> {
        // Identify the current page and set the state accordingly
        var pathname = window.location.pathname;
        if (pathname == '/') {
            this._currentPage = CurrentPage.Topics;
            this._currentTopicId = -1;
        } else {
            const re = /^\/topic\/(\d+)\/$/;
            var match = pathname.match(re);
            if (match != null) {
                this._currentPage = CurrentPage.Topic;
                this._currentTopicId = Number(match[1]);
            }
        }

        // If the user is on the topics page, we already have the coordinates of the topic houses
        var source: Document = document;

        // If the user is on a topic page, we need to fetch the topics page to get the coordinates
        // of the topic houses
        if (this._currentPage == CurrentPage.Topic) {
            var response = await fetch('/', { headers: { 'Refresh': '' } });
            var text = await response.text();
            var parser = new DOMParser();
            source = parser.parseFromString(text, 'text/html');
        }

        // Generate a map to link topic ids with the coordinates of their houses
        var topicElements = [...source.querySelectorAll('[topic-id]')];
        for (var elm of topicElements) {
            var topicId = Number(elm.getAttribute('topic-id'));
            var x = Number(elm.getAttribute('absolute-x'));
            var z = Number(elm.getAttribute('absolute-z'));
            this._topicPositions.set(topicId, { x, z });
        }

        // Reload the page when the user clicks the back button
        window.addEventListener("popstate", (): void => {
            window.location.reload();
        });
    },

    // Get the coordinates of the player
    _getPlayerPosition: function(): Position {
        return {
            x: (this._player as any).object3D.position.x as number,
            z: (this._player as any).object3D.position.z as number
        };
    },

    // Watch for inter-page navigation based on the player's position
    tick: function(): void {
        // When a page is being navigated to, prevent multiple requests of the page
        if (this._isLocked) return;

        // If the user may be navigating from the topics page to an individual topic
        if (this._currentPage == CurrentPage.Topics) {
            var playerPosition: Position = this._getPlayerPosition();

            // Determine if the player is deep enough on the z-axis to be at the topic houses
            if (playerPosition.z > -10 || playerPosition.z < -11) return;

            // Determine if the player is close enough to a given topic door
            this._currentTopicId = -1;
            for (var [topicId, topicPosition] of this._topicPositions) {
                if (Math.abs(playerPosition.x - topicPosition.x) < 1) {
                    this._currentTopicId = topicId;
                    break;
                }
            }

            if (this._currentTopicId < 0) return;

            this._isLocked = true;

            // Request and transition to the selected topic page
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

        // If the user may be navigating from a topic page to the topics page
        } else if (this._currentPage == CurrentPage.Topic) {
            // Check if the user has not entered topic exit wall
            if (this._getPlayerPosition().z <= 0) return;

            this._isLocked = true;

            // Request and transition to the topics page
            var url = '/';
            fetch(url, { headers: { 'Refresh': '' }})
            .then((response) => response.text())
            .then((text) => {
                this._scene.innerHTML = text;
                this._currentPage = CurrentPage.Topics;

                window.history.pushState(undefined, '', url);
                
                var topicPosition = this._topicPositions.get(this._currentTopicId)!;
                this._player.object3D.position.x = topicPosition.x;
                this._player.object3D.position.z = topicPosition.z;

                this._isLocked = false;
            });
        }
    }
});
