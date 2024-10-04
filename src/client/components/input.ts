'use strict';

AFRAME.registerComponent('input', {
    _allowed_characters: [] as string[],
    _isFocused: false,
    _insertionPoint: 0,

    init: function(): void {
        var chars = 'abcdefghijklmnopqrstuvwxyz';
        chars += chars.toUpperCase();
        chars += '`1234567890-=~!@#$%^&*()_+[]\\{}|;\':",./<>? ';
        if (this._isTypeTextArea()) chars += '\n';

        this._allowed_characters = chars.split('')
    },

    focus(): void {
        this._isFocused = true;
    },

    unfocus(): void {
        this._isFocused = false;
    },

    _getValue(): string {
        return this.el.getAttribute('value');
    },

    _setValue(value: string): void {
        this.el.setAttribute('value', value);
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

    _insertText(original: string, text: string, position: number): string {
        return original.slice(0, position) + text + original.slice(position);
    },

    _setDisplayText(text: string) {

    },

    tick: function(time: number, timeDelta: number): void
    {
        if (this._isTypeHidden()) return;

        var text: string = '';
        if (this._isTypeSubmit()) {
            var text = '[ Submit ]';
            if (this._isFocused) text = text.toUpperCase();
        } else if (this._isTypeClose()) {
            var text = '[ Close ]';
            if (this._isFocused) text = text.toUpperCase();
        } else if (this._isTypeText() || this._isTypeTextArea()) {
            var text = this._getValue();
            if (this._isFocused) {
                var cursor = (time % 800 < 400) ? '|' : ' ';

                var text = this._insertText(text, cursor, this._insertionPoint);
            }
        }

        this.el.setAttribute('text', {
            baseline: 'top',
            color: 'black',
            value: text
        });
    },

    processKeyboardEvent: function(event: KeyboardEvent): void {
        var key = event.key;
        if (this._isTypeSubmit()) {
            if (key == 'Enter') {
                document.querySelector('[form]').components.form.submit();
            }
        } else if (this._isTypeClose()) {
            if (key == 'Enter') {
                document.querySelector('[form]').components.form.remove();
            }
        } else if (this._isTypeText() || this._isTypeTextArea()) {
            var currentValue = this.el.getAttribute('value');

            if (key == 'Enter') key = '\n';

            if (this._allowed_characters.includes(key)) {
                var value = this._insertText(currentValue, key, this._insertionPoint);
                this._setValue(value);
                this._insertionPoint++;
            } else if (key == 'Backspace') {
                if (this._insertionPoint > 0) {
                    var value = this._getValue();
                    value = value.substring(0, this._insertionPoint - 1) +
                        value.substring(this._insertionPoint);
                    this._setValue(value);
                    this._insertionPoint--;
                }
            } else if (key == 'ArrowLeft') {
                this._insertionPoint = Math.max(0, this._insertionPoint - 1);
            } else if (key == 'ArrowRight') {
                this._insertionPoint = Math.min(this._getValue().length, this._insertionPoint + 1);
            }
        }
    }
});
