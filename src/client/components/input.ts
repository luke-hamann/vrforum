'use strict';

AFRAME.registerComponent('input', {
    _allowed_characters: [] as string[],
    _isFocused: false,

    init: function(): void {
        var chars = 'abcdefghijklmnopqrstuvwxyz';
        chars += chars.toUpperCase();
        chars += '`1234567890-=~!@#$%^&*()_+[]\\{}|;\':",./<>? ';
        if (this._isTypeTextArea()) chars += '\n';

        this._allowed_characters = chars.split('')
        this._updateTextRendering();
    },

    _getType(): string {
        return this.el.getAttribute('type');
    },

    _isTypeText: function(): boolean {
        return this._getType() == 'text';
    },

    _isTypeTextArea: function(): boolean {
        return this._getType() == 'textarea';
    },

    _isTypeSubmit: function(): boolean {
        return this._getType() == 'submit';
    },

    _isTypeClose: function(): boolean {
        return this._getType() == 'close';
    },

    _isTypeHidden: function(): boolean {
        return (this.el.getAttribute('type') === 'hidden');
    },

    _setDisplayText(text: string) {
        this.el.setAttribute('text', {
            baseline: 'top',
            color: 'black',
            value: text
        });
    },

    _updateTextRendering: function(): void
    {
        if (this._isTypeHidden()) return;

        if (this._isTypeSubmit())
        {
            var text = '[ Submit ]';
            if (this._isFocused) text = text.toUpperCase();
            this._setDisplayText(text);
        }
        else if (this._isTypeClose())
        {
            var text = '[ Close ]';
            if (this._isFocused) text = text.toUpperCase();
            this._setDisplayText(text);
        }
        else if (this._isTypeText() || this._isTypeTextArea())
        {
            var value = this.el.getAttribute('value');
            this._setDisplayText(value);
        }
    },

    focus(): void {
        this._isFocused = true;
    },

    unfocus(): void {
        this._isFocused = false;
    },

    processKeyboardEvent: function(event: KeyboardEvent): void {
        var key = event.key;

        if (this._isTypeText() || this._isTypeTextArea()) {
            if (key == 'Enter') key = '\n';

            if (this._allowed_characters.includes(key)) {
                var value = this.el.getAttribute('value');
                this.el.setAttribute('value', value + key);
                this._updateTextRendering();
            }
        } else if (this._isTypeSubmit()) {
            if (key == 'Enter') {
                document.querySelector('[form]').components.form.submit();
            }
        } else if (this._isTypeClose()) {
            if (key == 'Enter') {
                document.querySelector('[form]').components.form.remove();
            }
        }
    }


});
