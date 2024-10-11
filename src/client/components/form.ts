'use strict';

AFRAME.registerComponent('form', {
    _input_elements: [] as Element[],
    _tab_order: [] as number[],
    _tab_order_index: 0,

    // Initalize the form in the scene
    init: function(): void {
        // Disable wasd movement and the cursor
        document.querySelector('[camera]').removeAttribute('wasd-controls');
        document.querySelector('#cursor').setAttribute('raycaster', {
            enabled: false
        });

        // Construct the list of input elements and the tab order
        this._input_elements = [...this.el.querySelectorAll('[input]')];
        this._tab_order = [];
        for (var i = 0; i < this._input_elements.length; i++) {
            var input = this._input_elements[i];
            var type = input.getAttribute('type');
            if (type !== 'hidden') {
                this._tab_order.push(i);
            }
        }

        // Focus the first focusable input on the form
        this._tab_order_index = 0;
        this.get_selected_input_component().focus();

        // Listen for key presses
        window.addEventListener('keydown', this._process_keyboard_event);
    },

    // Get the input component cooresponding to the selected input
    get_selected_input_component(): any {
        var index: number = this._tab_order[this._tab_order_index];
        var element: Element = this._input_elements[index];
        var component = (element as any).components.input;
        return component;
    },

    // Process keyboard events passed to the form
    _process_keyboard_event: function(event: KeyboardEvent): void {
        // Get the form component
        var form = document.querySelector('[form]').components.form;

        // If the user presses tab (and possibly shift), tab between focusable
        // inputs
        if (event.key == 'Tab') {
            event.preventDefault();
            form.tab(event.shiftKey);
        // Otherwise, forward the keyboard event to the selected input
        } else {
            var input_component = form.get_selected_input_component();
            input_component.process_keyboard_event(event);
        }
    },

    // Tab between form inputs
    tab(backwards: boolean): void {
        // Unfocus the originally selected component
        var selected_component = this.get_selected_input_component();
        selected_component.unfocus();

        // If the user tabs backwards, decrement the tab order index
        if (backwards) {
            this._tab_order_index--;
            if (this._tab_order_index < 0) {
                this._tab_order_index = this._tab_order.length - 1;
            }
        // If the user tabs forward, increment the tab order index
        } else {
            this._tab_order_index++;
            this._tab_order_index %= this._tab_order.length;
        }

        // Focus the newly selected component
        selected_component = this.get_selected_input_component();
        selected_component.focus();
    },

    // Attempt to submit the form
    submit: async function(): Promise<void> {
        // Get all the inputs with name attributes
        var inputs: Element[] = [...this.el.querySelectorAll('[input]')]
            .filter((elm) => elm.hasAttribute('name'));
        
        // Construct a payload to send to the server based on the form inputs
        var payload = new URLSearchParams();
        for (var input of inputs) {
            var name = input.getAttribute('name');
            var value = input.getAttribute('value');
            payload.set(name!, value!);
        }

        // POST the payload to the server
        var action: string = this.el.getAttribute('action');
        var response: Response;
        try {
            response = await fetch(action, {
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

        // Hot-swap the relevant piece of the DOM
        var selector: string = this.el.getAttribute('hotswap')!;
        var element: Element = document.querySelector(selector);
        element.outerHTML = content;

        // Remove the form after sucessful submission
        this.remove();
    },

    // Remove the form
    remove: function(): void {
        // Remove the form from the DOM
        this.el.parentNode?.removeChild(this.el);

        // Enable wasd movement and the cursor
        document.querySelector('[camera]').setAttribute('wasd-controls', '');
        document.querySelector('#cursor').setAttribute('raycaster', {
            enabled: true
        });

        // Stop listening for key presses
        window.removeEventListener('keydown', this._process_keyboard_event);
    }
});
