import Label from './text-form/label.js';
import Button from './text-form/button.js';
import TextField from './text-form/textfield.js';
import FormAction from './text-form/formaction.js';
import Form from './text-form/form.js';

export default class HeadsUpDisplay {
    constructor() {
        this._element = document.createElement('a-entity');

        this._backdrop = document.createElement('a-plane');
        this._backdrop.setAttribute('width', 2);
        this._backdrop.setAttribute('height', 2);
        this._backdrop.setAttribute('position', '-1 1 -2');
        this._backdrop.setAttribute('color', '#FFF');

        this._text = document.createElement('a-entity');
        this._text.setAttribute('position', '-1 1 -1.95');

        this._element.appendChild(this._backdrop);
        this._element.appendChild(this._text);

        this._new_post_form = new Form('New Post',
            [
                new Label('Topic'), new TextField('topic', false),
                new Label('Title'), new TextField('title', false),
                new Label('Body'), new TextField('body', true),
                new Button('Submit', FormAction.Submit),
                new Button('Clear', FormAction.Reset)
            ],
            [1, 3, 5, 6, 7]
        )

        this.refresh();
    }

    getElement() {
        return this._element;
    }

    processKeyDownEvent(event) {
        var formAction = this._new_post_form.processKeyDownEvent(event);
        this.refresh();

        if (formAction == FormAction.Submit) {
            return this._new_post_form.getValues();
        }
    }

    show() {
        this._element.setAttribute('visible', true);
    }

    hide() {
        this._element.setAttribute('visible', false);
    }

    isVisible() {
        return this._element.getAttribute('visible');
    }

    toggleVisible() {
        this._element.setAttribute('visible', !this._element.getAttribute('visible'));
    }

    refresh() {
        this._text.setAttribute('text', {
            anchor: 'left',
            baseline: 'top',
            color: 'black',
            width: 2,
            value: this._new_post_form.render()
        });
    }

    reset() {
        this._new_post_form.reset();
        this.refresh();
    }
}

