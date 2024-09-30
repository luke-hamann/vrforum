import TextField from './textfield.js';
import Button from './button.js';
import FormAction from './formaction.js';

export default class Form {
    constructor(title, controls, tabOrder) {
        this._title = title;
        this._controls = controls;
        this._tabOrder = tabOrder;

        this._tabSelection = 0;
        this._validationErrors = [];

        this.focus();
    }

    setValidationErrors(errors) {
        this._tabSelection = 0;
        this._validationErrors = errors;

        this.focus();
    }

    getFocusedControl() {
        var selectedIndex = this._tabOrder[this._tabSelection];
        var control = this._controls[selectedIndex];
        return control;
    }

    focus() {
        this.unfocus();
        this.getFocusedControl().focus();
    }

    unfocus() {
        for (var control of this._controls) {
            if (control instanceof Button || control instanceof TextField)
                control.unfocus();
        }
    }

    getTextFields() {
        return this._controls.filter(
            (control) => (control instanceof TextField));
    }

    _moveFocusDown() {
        this._tabSelection++;
        this._tabSelection %= this._tabOrder.length;
        this.focus();
    }

    _moveFocusUp() {
        this._tabSelection--;
        if (this._tabSelection < 0) {
            this._tabSelection = this._tabOrder.length - 1;
        }
        this.focus();
    }

    reset() {
        this._tabSelection = 0;
        this._validationErrors = [];
        for (var textField of this.getTextFields()) {
            textField.clear();
        }
        this.focus();
    }

    processKeyDownEvent(event) {
        if (event.key == 'Tab') {
            if (event.shiftKey) this._moveFocusUp();
            else this._moveFocusDown();
            return;
        }

        // Forward the key event to the focused control
        var result = this.getFocusedControl().processKeyDownEvent(event);

        if (result == FormAction.Reset) {
            this.reset();
        }

        return result;
    }

    getValues() {
        var values = new Map();
        for (var textField of this.getTextFields()) {
            values.set(textField.getName(), textField.getValue());
        }
        return values;
    }

    render() {
        var output = this._title + '\n\n';

        for (var error of this._validationErrors) {
            output += `* ${error}\n`
        }
        if (this._validationErrors.length > 0) output += '\n';

        for (var control of this._controls) {
            var isTextField = (control instanceof TextField);

            if (isTextField) {
                if (control.isNewLinesAllowed()) output += '\n';
                else output += ' ';
            };
            output += control.render();

            if (isTextField && control.isNewLinesAllowed()) output += '\n';
        }
        return output;
    }
}
