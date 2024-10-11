'use strict';

AFRAME.registerComponent('input', {
    _allowed_characters: [] as string[],
    _is_focused: false,
    _insertion_index: 0,

    // Initialize the input within the form
    init: function(): void {
        // Construct a string of characters that may be typed into the field
        var chars = 'abcdefghijklmnopqrstuvwxyz';
        chars += chars.toUpperCase();
        chars += '`1234567890-=~!@#$%^&*()_+[]\\{}|;\':",./<>? ';

        // If the input is a text area, new lines are allowed
        if (this._is_type_text_area()) chars += '\n';

        // Convert the character string to an array
        this._allowed_characters = chars.split('');
    },

    // Focus the input
    focus(): void {
        this._is_focused = true;
    },

    // Unfocus the input
    unfocus(): void {
        this._is_focused = false;
    },

    // Get the current value of the input
    _get_value(): string {
        return this.el.getAttribute('value');
    },

    // Set the current value of the input
    _set_value(value: string): void {
        this.el.setAttribute('value', value);
    },

    // Get the type of the input
    _get_type(): string {
        return this.el.getAttribute('type');
    },

    // Determine if the input is a text box
    _is_type_text: function(): boolean {
        return this._get_type() == 'text';
    },

    // Determine if the input is a text area
    _is_type_text_area: function(): boolean {
        return this._get_type() == 'textarea';
    },

    // Determine if the input is a submit button
    _is_type_submit: function(): boolean {
        return this._get_type() == 'submit';
    },

    // Determine if the input is a close button
    _is_type_close: function(): boolean {
        return this._get_type() == 'close';
    },

    // Determine if the input is a hidden field
    _is_type_hidden: function(): boolean {
        return this.el.getAttribute('type') == 'hidden';
    },

    // Insert a substring into another string at a specified position
    _insert_text(original: string, text: string, position: number): string {
        return original.slice(0, position) + text + original.slice(position);
    },

    // Render the input element on the form each frame
    tick: function(time: number, _: number): void {
        // Hidden inputs should not be rendered
        if (this._is_type_hidden()) return;

        var text: string = '';

        // Submit buttons
        if (this._is_type_submit()) {
            text = '[ Submit ]';
            if (this._is_focused) text = text.toUpperCase();

        // Close buttons
        } else if (this._is_type_close()) {
            text = '[ Close ]';
            if (this._is_focused) text = text.toUpperCase();

        // Text boxes and text areas
        } else if (this._is_type_text() || this._is_type_text_area()) {
            text = this._get_value();
            if (this._is_focused) {
                // Create the flashing cursor
                var cursor = (time % 800 < 400) ? '|' : ' ';

                // Insert the cursor into the rendered representation of the
                // input's value
                text = this._insert_text(text, cursor, this._insertion_index);
            }
        }

        // Update the textual representation of the input on the form
        this.el.setAttribute('text', {
            baseline: 'top',
            color: 'black',
            value: text
        });
    },

    // Process a keyboard event that is passed to the input
    process_keyboard_event: function(event: KeyboardEvent): void {
        if (!this._is_focused) return;

        var key = event.key;

        // Hitting enter on a submit button should submit the form
        if (this._is_type_submit()) {
            if (key == 'Enter') {
                document.querySelector('[form]').components.form.submit();
            }
        
        // Hitting enter on a close button should close the form.
        } else if (this._is_type_close()) {
            if (key == 'Enter') {
                document.querySelector('[form]').components.form.remove();
            }

        // Process interactions with text boxes and text areas
        } else if (this._is_type_text() || this._is_type_text_area()) {
            if (key == 'Enter') key = '\n';

            // If the user is attempting to type text
            if (this._allowed_characters.includes(key)) {
                var value = this._insert_text(this._get_value(), key,
                    this._insertion_index);
                this._set_value(value);
                this._insertion_index++;

            // Deleting text
            } else if (key == 'Backspace') {
                if (this._insertion_index <= 0) return;

                var value = this._get_value();
                value = value.substring(0, this._insertion_index - 1) +
                    value.substring(this._insertion_index);
                this._set_value(value);
                this._insertion_index--;
            
            // Navigation
            } else if (key == 'ArrowLeft') {
                if (this._insertion_index <= 0) return;
                this._insertion_index--;
            } else if (key == 'ArrowRight') {
                if (this._insertion_index >= this._get_value().length)
                    return;
                this._insertion_index++;
            }
        }
    }
});
