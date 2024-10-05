'use strict';

enum PageState {
    Topics,
    Topic
}

AFRAME.registerSystem('teleporter', {
    _state: PageState.Topics,
    _player: document.querySelector('[camera]'),
    _scene: document.querySelector('.scene'),
    _topics: [...document.querySelectorAll('[topic_id]')].map((elm) => {
        return {
            topic_id: elm.getAttribute('topic_id'),
            x: (elm as any).object3D.position.x,
            z: (elm as any).object3D.position.z
        };
    }),
    _locked: false,

    tick: function() {
        if (this._locked) return;

        var x: number = (this._player as any).object3D.position.x;
        var z: number = (this._player as any).object3D.position.z;

        if (this._state == PageState.Topics && z < -10) {
            this._locked = true;
            fetch('/topic/2/', { headers: { 'Refresh': '' }})
            .then((response) => response.text())
            .then((text) => {
                this._scene.innerHTML = text;
                this._state = PageState.Topic;
                this._locked = false;
            })
        }

        if (this._state == PageState.Topic && z > -10) {
            this._locked = true;
            fetch('/', { headers: { 'Refresh': '' }})
            .then((response) => response.text())
            .then((text) => {
                this._scene.innerHTML = text;
                this._state = PageState.Topics;
                this._locked = false;
            });
        }
    }
});
