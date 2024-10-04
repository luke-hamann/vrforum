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
        this._inputs = [...this.el.querySelectorAll('[input]')];
        this._tab_order = [];
        for (var i = 0; i < this._inputs.length; i++) {
            var input = this._inputs[i];
            var type = input.getAttribute('type');
            if (type !== 'hidden') {
                this._tab_order.push(i);
            }
        }
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
        var index = this._tab_order[this._selected];
        var component = (this._inputs[index] as any).components.input;
        return component;
    },

    _processKeyboardEvent: function(event: KeyboardEvent): void {
        event.preventDefault();

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
        var inputs: Element[] = [...this.el.querySelectorAll('[input]')]
            .filter((elm) => elm.hasAttribute('name'));
        
        var payload = new URLSearchParams();
        for (const input of inputs) {
            var name = input.getAttribute('name');
            var value = input.getAttribute('value');
            payload.set(name!, value!);
        }

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

        var content: string;
        try {
            content = await response.text();
        } catch {
            return;
        }

        if (payload.get('action') == 'post') {
            var scene = document.querySelector('.scene');
            scene.innerHTML = content;
        } else if (payload.get('action') == 'reply') {
            var post_id = payload.get('post_id');
            var thread = document.querySelector(`[thread-post-id="${post_id}"]`);
            thread.innerHTML = content;
        }

        this.remove();
    }
});
