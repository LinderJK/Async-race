import './garage.scss';
import { button, div, h1, input } from '../../page/components/BaseComponents';
import { ComponentMap, IComponent, IInput } from '../../types/components-types';
import { CarData, CarsData, ILoader } from '../../types/data-types';
import Car from '../car/Car';

class Garage {
    loader;

    garageView = this.createGarageView();

    inputs: ComponentMap = this.garageView.map
        .get('config')
        ?.getAllChildrenMap();

    carList: IComponent | undefined = this.garageView.map.get('car-list');

    carsNumbers: Promise<number>;

    constructor(loader: ILoader) {
        this.loader = loader;
        this.carsNumbers = this.getCarsNumbers();
        this.updateView();
    }

    updateView() {
        this.garageView.map
            .get('garage-title')
            ?.setTextContent(`Garage ${this.carsNumbers}`);
    }

    getCarsNumbers(): Promise<number> {
        return this.loader
            .load()
            .then((r) => {
                console.log(r, 'LENGTH', r.length);
                return r.length;
            })
            .catch((error) => {
                console.log(error);
                return 0;
            });
    }

    draw(data: CarsData) {
        data.forEach((carData) => {
            const car = new Car(carData);
            const carView = car.createCarView();
            this.carList?.append(carView);
        });
        return this.garageView.element;
    }

    handleAddCar() {
        const colorInput = this.inputs?.get('color-car') as IInput;
        const nameInput = this.inputs?.get('name-car') as IInput;

        const color = colorInput.getValue();
        const name = nameInput.getValue();
        console.log(color, name);
        if (!colorInput || !nameInput || !this.carList) {
            console.error('error color input is not valid');
        }
        this.loader
            .createCar(name, color)
            .then((r) => {
                const car = new Car(r as CarData);
                const carView = car.createCarView();
                if (this.carList) {
                    this.carList.append(carView);
                }
                console.log(r);
            })
            .catch((error) => {
                console.error('Error creating car:', error);
            });
    }

    // eslint-disable-next-line class-methods-use-this
    // private createCarView(carData: CarsData[number]) {
    //     const { name, id } = carData;
    //     const car = div(
    //         'car',
    //         div(
    //             'car__nav',
    //             button('nav__select-car button-select', 'Select', () => {}),
    //             button('nav__remove-car button-remove', 'Remove', () => {}),
    //             p('nav__name-car', `${name}`)
    //         ),
    //         div(
    //             'car-view my-2',
    //             div(
    //                 'car-view__control',
    //                 button('a-btn', 'A', () => {}),
    //                 button('b-btn', 'B', () => {})
    //             ),
    //             div(
    //                 'car-view__draw',
    //                 div('car-image', image('image', CarSvg, 'car-svg')),
    //                 div('flag-image', image('flag-image', FlagSvg, 'flag-svg'))
    //             )
    //         )
    //     );
    //     car.setAttributes({ id: `${id}` });
    //     // car.setTextContent(`${name}, ${id},   ${color}`);
    //     return car;
    // }

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
            div(
                'garage',
                h1('garage-title', `Garage ${this.carsNumbers}`),
                div('car-list')
            )
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
