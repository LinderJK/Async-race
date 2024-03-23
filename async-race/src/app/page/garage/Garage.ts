import CarSvg from './assets/car.svg';
import FlagSvg from './assets/flag.svg';
import { CarData, IComponent } from '../../types/types';
import './garage.scss';
import { button, div, h1, image, p } from '../components/BaseComponents';

class Garage {
    draw(data: CarData, container: IComponent) {
        const garage = this.createGarage(data);
        const carlist = garage.map.get('car-list');

        data.forEach((carData) => {
            const carElement = this.createCar(carData);
            carlist?.append(carElement);
        });

        container.append(garage.element);
    }

    // eslint-disable-next-line class-methods-use-this
    createCar(carData: CarData[number]) {
        const { name } = carData;
        const car = div(
            'car',
            div(
                'car__nav',
                button('nav__select-car button-select', 'Select', () => {}),
                button('nav__remove-car button-remove', 'Remove', () => {}),
                p('nav__name-car', `${name}`)
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
        // car.setTextContent(`${name}, ${id},   ${color}`);
        return car;
    }

    // eslint-disable-next-line class-methods-use-this
    createGarage(data: CarData) {
        const content = div(
            'garage-container',
            h1('garage-title', `Garage ${data.length}`),
            div('car-list')
        );
        return {
            element: content,
            map: content.getAllChildrenMap(),
        };
    }
}

export default Garage;
