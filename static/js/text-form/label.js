export default class Label {
    constructor(name) {
        this._name = name;
    }

    getName() {
        return this._name;
    }

    render() {
        return this._name + ':';
    }
}
