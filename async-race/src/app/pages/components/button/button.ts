import './button.scss';
import Component from '../Component';

interface IButtonConstructor {
    className: string;
    textContent: string;
    clickHandler?: ((evt: Event) => void) | undefined;
}

class Button extends Component {
    private readonly clickHandler: (evt: Event) => void;

    constructor({ className, textContent, clickHandler }: IButtonConstructor) {
        super({
            tagName: 'button',
            className: `${className} button`,
            textContent,
        });
        this.clickHandler = clickHandler ?? (() => {});
        this.addListener('click', this.clickHandler);
    }

    delete() {
        if (this.clickHandler) {
            this.removeListener('click', this.clickHandler);
        }
        super.delete();
    }
}

export default Button;
