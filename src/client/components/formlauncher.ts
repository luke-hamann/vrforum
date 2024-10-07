'use strict';

AFRAME.registerComponent('formlauncher', {
    schema: {
        action: {type: 'string'},
        id: {type: 'int'},
        name: {type: 'string'}
    },

    init: function() {
        var mount = document.querySelector('[formmount]');

        this.el.addEventListener('click', async () => {
            var action = this.data.action;
            var url;
            if (action == 'post') {
                url = `/topic/${this.data.id}/post/`;
            } else if (action == 'reply') {
                url = `/post/${this.data.id}/reply/`;
            } else {
                return;
            }

            var response = await fetch(url);
            if (!response.ok) return;
            var content = await response.text();
            mount.innerHTML = content;
        });
    }
});
