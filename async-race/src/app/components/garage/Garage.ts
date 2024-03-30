import './garage.scss';
import {
    button,
    div,
    h1,
    input,
    p,
} from '../../page/components/BaseComponents';
import { ComponentMap, IComponent, IInput } from '../../types/components-types';
import { CarsData } from '../../types/data-types';
import Car from '../car/Car';
import Loader from '../../services/loader';

class Garage {
    // loader;

    view = this.createGarageView();

    inputs: ComponentMap;

    carList: IComponent;

    title: IComponent;

    carsNumbers: number = 0;

    currentCar: Car | undefined = undefined;

    carsData: CarsData = [];

    currentPage = 1;

    carsPerPage = 4;

    constructor() {
        this.view = this.createGarageView();
        this.inputs = this.view.map.get('config')?.getAllChildrenMap();
        this.carList = this.view.map.get('car-list')!;
        this.title = this.view.map.get('garage-title')!;
        // this.loader = loader;
        this.updateView();
        this.setupObserver();

        this.updatePaginationButtons();
    }

    setupObserver() {
        const deleteCarHandler = async () => {
            // this.getCarsData();
            this.updateView();
        };
        const selectCarHandler: EventListener = (event: Event) => {
            // const selectedCarId = event.detail.selectedCar;
            // console.log(selectedCarId);

            const customEvent = event as CustomEvent;
            const { selectedCar } = customEvent.detail;

            this.currentCar = selectedCar;
            console.log(selectedCar, this.currentCar);
            this.inputs
                ?.get('color-car')
                ?.setAttributes({ value: `${this.currentCar?.Color}` });
            this.inputs
                ?.get('name-car')
                ?.setAttributes({ value: `${this.currentCar?.Name}` });
            if (this.currentCar) {
                // this.currentCar.updateView();
            }
            // const selectedCarData = await Loader.getCar(selectedCarId);
            // Теперь у вас есть данные выбранной машины, можно их использовать
            // console.log(selectedCarData);
        };

        document.addEventListener('deleteCar', deleteCarHandler);
        document.addEventListener('selectCar', selectCarHandler);
    }

    async updateView() {
        const data = await Loader.loadGarageData();
        this.carsData = data;
        this.carsNumbers = this.carsData.length;

        const startIndex = (this.currentPage - 1) * this.carsPerPage;
        const endIndex = startIndex + this.carsPerPage;
        const carsToShow = this.carsData.slice(startIndex, endIndex);

        this.title.setTextContent(`Garage ${this.carsNumbers}`);
        this.carList?.deleteChildren();
        this.drawCars(carsToShow);
        this.updatePaginationButtons();
        console.log(this.carsData, data);
        console.log(this.currentPage, startIndex, endIndex, carsToShow);
    }

    updatePaginationButtons() {
        const totalPages = Math.ceil(this.carsData.length / this.carsPerPage);
        console.log(totalPages, 'total pages');
        const prevButton = button('prev-page', 'Prev', () => {
            if (this.currentPage > 1) {
                this.currentPage -= 1;
                this.updateView();
            }
        });
        const nextButton = button('next-page', 'Next', () => {
            if (this.currentPage < totalPages) {
                this.currentPage += 1;
                this.updateView();
            }
        });

        const pagesInfo = p(
            'pages-info',
            `${this.currentPage} / ${totalPages}`
        );

        const paginationContainer = this.view.map?.get('pagination-container');
        paginationContainer?.deleteChildren();
        paginationContainer?.append(prevButton);
        paginationContainer?.append(pagesInfo);
        paginationContainer?.append(nextButton);
    }

    // getCarsNumbers(): Promise<number> {
    //     return this.loader
    //         .load()
    //         .then((r) => {
    //             console.log(r, 'LENGTH', r.length);
    //             return r.length;
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //             return 0;
    //         });
    // }

    drawCars(data: CarsData) {
        data.forEach((carData) => {
            const car = new Car(carData);
            // const carView = car.createCarView();
            this.carList?.append(car.view);
        });
        // return this.view.element;
    }

    async handleAddCar() {
        const colorInput = this.inputs?.get('color-car') as IInput;
        const nameInput = this.inputs?.get('name-car') as IInput;

        const color = colorInput.getValue();
        const name = nameInput.getValue();
        console.log(color, name);
        if (!colorInput || !nameInput || !this.carList) {
            console.error('error color input is not valid');
        }
        try {
            const carData = await Loader.addCar(name, color);
            const car = new Car(carData);
            const carView = car.createView();
            if (this.carList) {
                this.carList.append(carView);
            }
            console.log(carData);
        } catch (error) {
            console.error('Error creating car:', error);
        }
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
            ),
            div('pagination-container')
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
