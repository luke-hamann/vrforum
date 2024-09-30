export default class Button {
    constructor(name, action) {
        this._name = name;
        this._action = action;
        this._selected = false;
    }

    focus() {
        this._selected = true;
    }

    unfocus() {
        this._selected = false;
    }

    processKeyDownEvent(event) {
        if (this._selected && event.key == 'Enter') {
            return this._action;
        }
    }

    render() {
        var name = this._name;
        var highlight = ' ';
        if (this._selected) {
            name = name.toUpperCase();
            highlight = '_';
        }
        return `[${highlight}${name}${highlight}]`;
    }
}
