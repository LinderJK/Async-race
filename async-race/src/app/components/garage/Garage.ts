import './garage.scss';
import {
    button,
    div,
    h1,
    input,
    p,
} from '../../page/components/BaseComponents';
import {
    ComponentMap,
    IComponent,
    IInput,
    PageView,
} from '../../types/components-types';
import { CarsData } from '../../types/data-types';
import Car from '../car/Car';
import Loader from '../../services/loader';
import getRandomColor from '../../utils/getRandomColor';
import getRandomCarName from '../../utils/getRandomCarName';

class Garage {
    view: PageView;

    inputs: ComponentMap;

    carList: IComponent;

    title: IComponent;

    carsData: CarsData = [];

    carsNumbers: number = 0;

    currentCar: Car | undefined = undefined;

    currentPage = 1;

    carsPerPage = 4;

    carsToCreate = 100;

    constructor() {
        this.view = this.createGarageView();
        if (!this.view.map) {
            console.error('dont get garage view map');
            throw new Error('dont get garage view map');
        }
        this.inputs = this.view.map.get('config')?.getAllChildrenMap();
        this.carList = this.view.map.get('car-list')!;
        this.title = this.view.map.get('garage-title')!;
        this.updateView();
        this.setupObserver();
        this.updatePaginationButtons();
    }

    setupObserver() {
        const deleteCarHandler = async () => {
            this.updateView();
        };
        const selectCarHandler: EventListener = (event: Event) => {
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

    drawCars(data: CarsData) {
        data.forEach((carData) => {
            const car = new Car(carData);
            // const carView = car.createCarView();
            this.carList?.append(car.view);
        });
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
            if (this.carsNumbers <= this.carsPerPage) {
                const car = new Car(carData);
                const carView = car.createView();
                if (this.carList) {
                    this.carList.append(carView);
                }
            }

            console.log(carData);
        } catch (error) {
            console.error('Error creating car:', error);
        }
        this.updateView();
    }

    async handleUpdateCar() {
        const colorInput = this.inputs?.get('color-car') as IInput;
        const nameInput = this.inputs?.get('name-car') as IInput;

        const color = colorInput.getValue();
        const name = nameInput.getValue();
        console.log(color, name);
        if (!colorInput || !nameInput || !this.carList || !this.currentCar) {
            console.error('error color input is not valid');
            return;
        }

        try {
            const carData = await Loader.updateCar(
                this.currentCar.id,
                name,
                color
            );
            console.log(carData);
        } catch (error) {
            console.error('Error update car:', error);
        }
        await this.updateView();
    }

    async createRandomCars() {
        const newCars = [];

        for (let index = 0; index < this.carsToCreate; index += 1) {
            const color = getRandomColor();
            const name = getRandomCarName();
            const car = { color, name };
            newCars.push(car);
        }

        const promises = newCars.map(async (car) => {
            try {
                const carData = await Loader.addCar(car.name, car.color);
                console.log(carData);
            } catch (error) {
                console.error('Error creating car:', error);
            }
        });

        await Promise.all(promises);
        console.log(newCars);
        await this.updateView();
    }

    private createGarageView() {
        const content = div(
            'garage-container',
            div(
                'config',
                input('color-car', 'color'),
                input('name-car', 'text', 'add car name'),
                button('add-car', 'Add Car', () => {
                    this.handleAddCar();
                }),
                button('update-car', 'Update selected', () => {
                    this.handleUpdateCar();
                })
            ),
            div(
                'garage',
                h1('garage-title', `Garage ${this.carsNumbers}`),
                div('car-list')
            ),
            button('generate-car', 'Add 100 cars', () => {
                this.createRandomCars();
            }),
            div('pagination-container')
        );
        return {
            element: content,
            map: content.getAllChildrenMap(),
        };
    }
}

export default Garage;
