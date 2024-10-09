'use strict';

AFRAME.registerComponent('form', {
    _inputElements: [] as Element[],
    _tabOrder: [] as number[],
    _tabOrderIndex: 0,

    // Initalize the form in the scene
    init: function(): void {
        // Disable wasd movement and the cursor
        document.querySelector('[camera]').removeAttribute('wasd-controls');
        document.querySelector('#cursor').removeAttribute('cursor');

        // Construct the form's list of input elements and tab order
        this._inputElements = [...this.el.querySelectorAll('[input]')];
        this._tabOrder = [];
        for (var i = 0; i < this._inputElements.length; i++) {
            var input = this._inputElements[i];
            var type = input.getAttribute('type');
            if (type !== 'hidden') {
                this._tabOrder.push(i);
            }
        }

        // Focus the first focusable input on the form
        this._tabOrderIndex = 0;
        this.getSelectedInputComponent().focus();

        // Listen for key presses
        window.addEventListener('keydown', this._processKeyboardEvent);
    },

    // Remove the form
    remove: function() {
        // Remove the form from the DOM
        document.querySelector('[formmount]').innerHTML = '';

        // Enable wasd movement and the cursor
        document.querySelector('[camera]').setAttribute('wasd-controls', '');
        document.querySelector('#cursor').setAttribute('cursor', '');

        // Stop listening for key presses
        window.removeEventListener('keydown', this._processKeyboardEvent);
    },

    // Control tabbing between form inputs
    tab(backwards: boolean): void {
        // Unfocus the originally selected component
        var selectedComponent = this.getSelectedInputComponent();
        selectedComponent.unfocus();

        // If the user tabs backwards, decrement the tab index
        if (backwards) {
            this._tabOrderIndex--;
            if (this._tabOrderIndex < 0) {
                this._tabOrderIndex = this._tabOrder.length - 1;
            }
        // If the user tabs forwards, increment the tab index
        } else {
            this._tabOrderIndex++;
            this._tabOrderIndex %= this._tabOrder.length;
        }

        // Focus the newly selected component
        selectedComponent = this.getSelectedInputComponent();
        selectedComponent.focus();
    },

    // Get the A-Frame input component cooresponding to the selected input
    getSelectedInputComponent(): any {
        var index: number = this._tabOrder[this._tabOrderIndex];
        var element: Element = this._inputElements[index];
        var component = (element as any).components.input;
        return component;
    },

    // Process keyboard events passed to the form
    _processKeyboardEvent: function(event: KeyboardEvent): void {
        event.preventDefault();

        // Get the form component
        var form = document.querySelector('[form]').components.form;

        // If the user presses tab (and possibly shift), tab between focusable inputs
        if (event.key == 'Tab') {
            form.tab(event.shiftKey);
        // Otherwise, forward the keyboard event to the selected input
        } else {
            var input_component = form.getSelectedInputComponent();
            input_component.processKeyboardEvent(event);
        }
    },

    // Attempt to submit the form
    submit: async function() {
        // Get all the inputs with name attributes
        var inputs: Element[] = [...this.el.querySelectorAll('[input]')]
            .filter((elm) => elm.hasAttribute('name'));
        
        // Construct a payload to send to the server based on the form inputs
        var payload = new URLSearchParams();
        for (const input of inputs) {
            var name = input.getAttribute('name');
            var value = input.getAttribute('value');
            payload.set(name!, value!);
        }

        // POST the payload to the server
        var response: Response;
        try {
            response = await fetch('/', {
                method: 'POST',
                body: payload
            });
        } catch {
            return;
        }

        if (!response.ok) return;

        // Get the server's response
        var content: string;
        try {
            content = await response.text();
        } catch {
            return;
        }

        // Hot-swap the relevant piece of the DOM based on the action taken
        if (payload.get('action') == 'post') {
            var scene = document.querySelector('.scene');
            scene.innerHTML = content;
        } else if (payload.get('action') == 'reply') {
            var post_id = payload.get('post_id');
            var thread = document.querySelector(`[thread-post-id="${post_id}"]`);
            thread.innerHTML = content;
        }

        // Delete the form element after sucessful submission
        this.remove();
    }
});
