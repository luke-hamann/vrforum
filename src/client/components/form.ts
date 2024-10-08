'use strict';

AFRAME.registerComponent('form', {
    _inputs: [] as Element[],
    _tab_order: [] as number[],
    _selected: 0,

    init: function(): void {
        // Disable wasd movement and the cursor
        document.querySelector('[camera]').removeAttribute('wasd-controls');
        document.querySelector('#cursor').removeAttribute('cursor');

        // Update the list of child input components
        this._updateInputs();

        // Listen for key presses
        window.addEventListener('keydown', this._processKeyboardEvent);
    },

    remove: function() {
        // Remove the form from the DOM
        document.querySelector('[formmount]').innerHTML = '';

        // Enable wasd movement and the cursor
        document.querySelector('[camera]').setAttribute('wasd-controls', '');
        document.querySelector('#cursor').setAttribute('cursor', '');

        // Stop listening for key presses
        window.removeEventListener('keydown', this._processKeyboardEvent);
    },

    _updateInputs: function(): void {
        // Construct the form's list of inputs and tab order
        this._inputs = [...this.el.querySelectorAll('[input]')];
        this._tab_order = [];
        for (var i = 0; i < this._inputs.length; i++) {
            var input = this._inputs[i];
            var type = input.getAttribute('type');
            if (type !== 'hidden') {
                this._tab_order.push(i);
            }
        }

        // Focus the first focusable input on the form
        this._selected = 0;
        this.getSelectedInputComponent().focus();
    },

    tab(backwards: boolean): void {
        // Unfocus the originally selected component
        var selectedComponent = this.getSelectedInputComponent();
        selectedComponent.unfocus();

        // Modify the selection index
        if (backwards) {
            this._selected--;
            if (this._selected < 0) {
                this._selected = this._tab_order.length - 1;
            }
        } else {
            this._selected++;
            this._selected %= this._tab_order.length;
        }

        // Focus the newly selected component
        selectedComponent = this.getSelectedInputComponent();
        selectedComponent.focus();
    },

    getSelectedInputComponent(): any {
        // Get the A-Frame input component cooresponding to the selected input
        var index: number = this._tab_order[this._selected];
        var element: Element = this._inputs[index];
        var component = (element as any).components.input;
        return component;
    },

    _processKeyboardEvent: function(event: KeyboardEvent): void {
        event.preventDefault();

        // Get the form component
        var form = document.querySelector('[form]').components.form;

        // Tab between focusable inputs
        if (event.key == 'Tab') {
            form.tab(event.shiftKey);
            return;
        }

        // Forward the keyboard event to the selected control
        var input_component = form.getSelectedInputComponent();
        input_component.processKeyboardEvent(event);
    },

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
