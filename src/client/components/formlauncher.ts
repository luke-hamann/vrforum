'use strict';

AFRAME.registerComponent('formlauncher', {
    schema: { type: 'string' }, // The url of the form

    // Initialize the form launcher in the scene
    init: function (): void {
        // Make the a-entity clickable to launch the form
        this.el.addEventListener('click', async (): Promise<void> => {
            // Fetch the form from the server
            var url: string = this.data;
            var form: string;
            try {
                var response: Response = await fetch(url);
                if (!response.ok) return;
                form = await response.text();
            } catch {
                return;
            }

            // Inject the form into the page
            document.querySelector('[formmount]').innerHTML = form;
        });
    }
});
