import CarSvg from '../../../assets/car.svg';
import FlagSvg from '../../../assets/flag.svg';
import './garage.scss';
import {
    button,
    div,
    h1,
    image,
    input,
    p,
} from '../../page/components/BaseComponents';
import {
    ComponentMap,
    IComponent,
    IInput,
    ILoader,
} from '../../types/components';
import { CarData, CarsData } from '../../types/data';

class Garage {
    loader;

    garage = this.createGarageView();

    inputs: ComponentMap;

    carList: IComponent | undefined;

    constructor(loader: ILoader) {
        this.loader = loader;
        this.inputs = this.garage.map.get('config')?.getAllChildrenMap();
        this.carList = this.garage.map.get('car-list');
    }

    draw(data: CarsData) {
        data.forEach((carData) => {
            const carElement = this.createCarView(carData);
            this.carList?.append(carElement);
        });
        return this.garage.element;
    }

    async handleAddCar() {
        const colorInput = this.inputs?.get('color-car') as IInput;
        const nameInput = this.inputs?.get('name-car') as IInput;

        const color = colorInput.getValue();
        const name = nameInput.getValue();
        console.log(color, name);

        if (!colorInput || !nameInput || !this.carList) {
            console.error('error');
            return;
        }
        const response = await this.loader.createCar(name, color);
        const newCar = this.createCarView(response as CarData);
        this.carList.append(newCar);

        // const color = colorElement.getValue();
        // console.log(color);
    }

    // eslint-disable-next-line class-methods-use-this
    private createCarView(carData: CarsData[number]) {
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
    private createGarageView() {
        const content = div(
            'garage-container',
            div(
                'config',
                input('color-car', 'color'),
                input('name-car', 'text', 'add car name'),
                button('add-car', 'Add Car', () => {
                    this.handleAddCar();
                })
            ),
            div('garage', h1('garage-title', `Garage`), div('car-list'))
        );
        return {
            element: content,
            map: content.getAllChildrenMap(),
        };
    }

    // async deleteCarHandler() {}

    // getGarageMap() {
    //     return this.garage.map.get('color-car').value;
    // }
}

export default Garage;
