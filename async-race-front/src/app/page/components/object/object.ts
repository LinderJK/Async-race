import Component from '../Component';

class ObjectComponent extends Component {
    constructor(objectElement: HTMLObjectElement) {
        super({
            tagName: 'object',
            className: '',
            attributes: {},
        });

        this.elem = objectElement;
    }
}

export default ObjectComponent;
