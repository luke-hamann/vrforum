export default class TextField {
    constructor(name, newlinesAllowed) {
        this._name = name;
        this._isNewLinesAllowed = newlinesAllowed;

        this._value = '';
        this._focused = false;
        this._insertionPoint = 0;

        var characters = 'qwertyuiopasdfghjklzxcvbnm';
        characters += characters.toUpperCase();
        characters += '`1234567890-=~!@#$%^&*()_+[]\\{}|;\':",./<>? ';
        this.CHARACTERS = characters;
    }

    getName() {
        return this._name;
    }

    focus() {
        this._focused = true;
    }

    unfocus() {
        this._focused = false;
    }

    /**
     * @returns {string}
     */
    getValue() {
        return this._value;
    }

    /**
     * @returns {boolean}
     */
    isNewLinesAllowed() {
        return this._isNewLinesAllowed;
    }

    clear() {
        this._value = '';
        this._insertionPoint = 0;
    }

    _insertCharacter(substring, position, text) {
        var left = text.slice(0, position);
        var right = text.slice(position);
        return left + substring + right;
    }

    _deleteCharacter(text, position) {
        if (position < 0 || position > text.length) return text;
        return text.substring(0, position - 1) + text.substring(position);
    }

    _updateValue(text) {
        this._value = this._insertCharacter(
            text, this._insertionPoint, this._value);
        this._insertionPoint += text.length;
    }

    processKeyDownEvent(event) {
        if (!this._focused) return;

        // Field navigation
        if (event.key == 'Home') {
            this._insertionPoint =
                this._value.lastIndexOf('\n', this._insertionPoint - 1) + 1;
        } else if (event.key == 'End') {
            this._insertionPoint =
                this._value.indexOf('\n', this._insertionPoint);
            if (this._insertionPoint == -1) {
                this._insertionPoint = this._value.length;
            }
        } else if (event.key == 'ArrowLeft') {
            this._insertionPoint = Math.max(0, this._insertionPoint - 1);
        } else if (event.key == 'ArrowRight') {
            this._insertionPoint = Math.min(
                this._value.length, this._insertionPoint + 1);
        }

        // Character insertion and deletion
        else if (event.key == 'Enter' && this._isNewLinesAllowed) {
            this._updateValue('\n');
        } else if (this.CHARACTERS.includes(event.key)) {
            this._updateValue(event.key);
        } else if (event.key == 'Backspace' && this._insertionPoint > 0) {
            this._value = this._deleteCharacter(
                this._value, this._insertionPoint);
            this._insertionPoint--;
        }
    }

    render() {
        var output = this._value;
        if (this._focused) {
            output = this._insertCharacter(
                '_', this._insertionPoint, this._value);
        }
        output += '\n';
        return output;
    }
}
