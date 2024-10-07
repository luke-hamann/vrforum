'use strict';

enum CurrentPage {
    Topics,
    Topic
}

AFRAME.registerSystem('teleporter', {
    _current_page: CurrentPage.Topics,
    _current_topic_id: -1,
    _player: document.querySelector('[camera]'),
    _scene: document.querySelector('.scene'),
    _topics: new Map(),
    _locked: false,

    _getPlayerPosition: function() {
        return {
            x: (this._player as any).object3D.position.x as number,
            z: (this._player as any).object3D.position.z as number
        };
    },

    init: function() {
        var topic_elements = [...document.querySelectorAll('[topic-id]')];
        for (var elm of topic_elements) {
            var topic_id = Number(elm.getAttribute('topic-id'));
            var x = Number(elm.getAttribute('absolute-x'));
            var z = Number(elm.getAttribute('absolute-z'));
            this._topics.set(topic_id, { x, z });
        }
        console.log(this._topics);
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
            fetch(`/topic/${this._current_topic_id}/`, {
                headers: { 'Refresh': '' }
            })
            .then((response) => response.text())
            .then((text) => {
                this._scene.innerHTML = text;
                this._current_page = CurrentPage.Topic;

                this._player.object3D.position.x = 0;
                this._player.object3D.position.z = 0;

                this._locked = false;
            })
        } else if (this._current_page == CurrentPage.Topic) {
            if (this._getPlayerPosition().z <= 0) return;

            this._locked = true;
            fetch('/', { headers: { 'Refresh': '' }})
            .then((response) => response.text())
            .then((text) => {
                this._scene.innerHTML = text;
                this._current_page = CurrentPage.Topics;
                
                var x = this._topics.get(this._current_topic_id).x;
                var z = this._topics.get(this._current_topic_id).z;

                this._player.object3D.position.x = x;
                this._player.object3D.position.z = z;

                this._locked = false;
            });
        }
    }
});
