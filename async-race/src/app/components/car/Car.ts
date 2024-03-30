import './car.scss';
import { CarData } from '../../types/data-types';
import { button, div, image, p } from '../../page/components/BaseComponents';
import CarSvg from '../../../assets/car.svg';
import FlagSvg from '../../../assets/flag.svg';
import { IComponent } from '../../types/components-types';

class Car {
    id: number;

    color: string;

    name: string;

    view: IComponent;

    constructor(data: CarData) {
        this.id = data.id;
        this.view = this.createView();
        this.color = data.color;
        this.name = data.name;
    }

    // eslint-disable-next-line class-methods-use-this
    createView() {
        const car = div(
            'car',
            div(
                'car__nav',
                button('nav__select-car button-select', 'Select', () => {}),
                button('nav__remove-car button-remove', 'Remove', () => {}),
                p('nav__name-car', `${this.name}`)
            ),
            div(
                'car-view my-2',
                div(
                    'car-view__control',
                    button('a-btn', 'A', () => {}),
                    button('b-btn', 'B', () => {})
                ),
                div(
                    'car-view__draw',
                    div('car-image', image('image', CarSvg, 'car-svg')),
                    div('flag-image', image('flag-image', FlagSvg, 'flag-svg'))
                )
            )
        );
        car.setAttributes({ id: `${this.id}` });
        // car.setTextContent(`${name}, ${id},   ${color}`);
        return car;
    }
}

export default Car;
