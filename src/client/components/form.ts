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

        // Construct the list of input elements and the tab order
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

    // Get the input component cooresponding to the selected input
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
            var inputComponent = form.getSelectedInputComponent();
            inputComponent.processKeyboardEvent(event);
        }
    },

    // Tab between form inputs
    tab(backwards: boolean): void {
        // Unfocus the originally selected component
        var selectedComponent = this.getSelectedInputComponent();
        selectedComponent.unfocus();

        // If the user tabs backwards, decrement the tab order index
        if (backwards) {
            this._tabOrderIndex--;
            if (this._tabOrderIndex < 0) {
                this._tabOrderIndex = this._tabOrder.length - 1;
            }
        // If the user tabs forward, increment the tab order index
        } else {
            this._tabOrderIndex++;
            this._tabOrderIndex %= this._tabOrder.length;
        }

        // Focus the newly selected component
        selectedComponent = this.getSelectedInputComponent();
        selectedComponent.focus();
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
        document.querySelector('#cursor').setAttribute('cursor', '');

        // Stop listening for key presses
        window.removeEventListener('keydown', this._processKeyboardEvent);
    }
});
