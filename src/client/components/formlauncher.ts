'use strict';

AFRAME.registerComponent('formlauncher', {
    schema: {
        type: {type: 'string'}, // The type of form that should be launched (post or reply)
        id: {type: 'int'},      // The id of the topic or post
        name: {type: 'string'}  // The name of the topic or post
    },

    // Initialize the form launcher in the scene
    init: function() {
        // Get the a-entity form mount to inject the form HTML
        var mount = document.querySelector('[formmount]');

        // Make the a-entity clickable to launch the form
        this.el.addEventListener('click', async () => {
            // Determine the url of the form based on the form type and object id
            var type = this.data.type;
            var url;
            if (type == 'post') {
                url = `/topic/${this.data.id}/post/`;
            } else if (type == 'reply') {
                url = `/post/${this.data.id}/reply/`;
            } else {
                return;
            }

            // Fetch the form HTML and inject it into the form mount point
            var response = await fetch(url);
            if (!response.ok) return;
            var content = await response.text();
            mount.innerHTML = content;
        });
    }
});
