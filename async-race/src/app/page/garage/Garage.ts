import CarSvg from './assets/car.svg';
import FlagSvg from './assets/flag.svg';
import {
    CarsData,
    ComponentsMap,
    IAppLoader,
    IComponent,
    InputComponent,
} from '../../types/types';
import './garage.scss';
import { button, div, h1, image, input, p } from '../components/BaseComponents';

class Garage {
    loader;

    garage = this.createGarage();

    inputs: ComponentsMap;

    carlist: IComponent | undefined;

    constructor(loader: IAppLoader) {
        this.loader = loader;
        this.inputs = this.garage.map.get('config')?.getAllChildrenMap();
        this.carlist = this.garage.map.get('car-list');
    }

    draw(data: CarsData) {
        data.forEach((carData) => {
            const carElement = this.createCar(carData);
            this.carlist?.append(carElement);
        });
        return this.garage.element;
    }

    // drawCars(data) {}

    // eslint-disable-next-line class-methods-use-this
    private createCar(carData: CarsData[number]) {
        const { name, id } = carData;
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
        car.setAttributes({ id: `${id}` });
        // car.setTextContent(`${name}, ${id},   ${color}`);
        return car;
    }

    // eslint-disable-next-line class-methods-use-this
    private createGarage() {
        const content = div(
            'garage-container',
            div(
                'config',
                input('color-car', 'color'),
                input('name-car', 'text', 'add car name'),
                button('add-car', 'Add Car', () => {
                    this.addCarHandler();
                })
            ),
            div('garage', h1('garage-title', `Garage`), div('car-list'))
        );
        return {
            element: content,
            map: content.getAllChildrenMap(),
        };
    }

    async addCarHandler() {
        const colorInput = this.inputs?.get('color-car') as InputComponent;
        const nameInput = this.inputs?.get('name-car') as InputComponent;

        const color = colorInput.getValue();
        const name = nameInput.getValue();
        console.log(color, name);

        if (!colorInput || !nameInput || !this.carlist) {
            console.error('error');
            return;
        }
        const response = await this.loader.addCar(name, color);
        const newCar = this.createCar(response);
        this.carlist.append(newCar);
        // const color = colorElement.getValue();
        // console.log(color);
    }

    // async deleteCarHandler() {}

    // getGarageMap() {
    //     return this.garage.map.get('color-car').value;
    // }
}

export default Garage;
