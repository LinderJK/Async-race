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

    winnerName: IComponent | undefined = undefined;

    btnStartRace: IComponent | undefined = undefined;

    btnResetRace: IComponent | undefined = undefined;

    carsData: CarsData = [];

    carsInRace: Car[] = [];

    carsNumbers: number = 0;

    currentCar: Car | undefined = undefined;

    currentPage = 1;

    carsPerPage = 7;

    carsToCreate = 100;

    winnerCar: Car | undefined = undefined;

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
            await this.updateView();
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
        this.carsInRace = [];
        this.carsData = data;
        this.carsNumbers = this.carsData.length;

        const startIndex = (this.currentPage - 1) * this.carsPerPage;
        const endIndex = startIndex + this.carsPerPage;
        const carsToShow = this.carsData.slice(startIndex, endIndex);

        this.title.setTextContent(`Garage ${this.carsNumbers}`);
        this.carList?.deleteChildren();
        this.drawCars(carsToShow);
        this.updatePaginationButtons();
        // this.btnResetRace?.setAttributes({ disabled: true });
        // console.log(this.carsData, data);
        // console.log(this.currentPage, startIndex, endIndex, this.carsInRace);
    }

    updatePaginationButtons() {
        const totalPages = Math.ceil(this.carsData.length / this.carsPerPage);
        console.log(totalPages, 'total pages');
        const prevButton = button('prev-page', 'Prev', async () => {
            if (this.currentPage > 1) {
                this.currentPage -= 1;
                await this.updateView();
            }
        });
        const nextButton = button('next-page', 'Next', async () => {
            if (this.currentPage < totalPages) {
                this.currentPage += 1;
                await this.updateView();
            }
        });

        const pagesInfo = p(
            'pages-info',
            `${this.currentPage} / ${totalPages}`
        );

        const paginationContainer = this.view.map?.get('pagination-container');
        paginationContainer?.deleteChildren();
        paginationContainer?.appendChildren([
            prevButton,
            pagesInfo,
            nextButton,
        ]);
        // paginationContainer?.append(pagesInfo);
        // paginationContainer?.append(nextButton);
    }

    drawCars(carsData: CarsData) {
        carsData.forEach((car) => {
            const newCar = new Car(car);
            this.carList?.append(newCar.view);
            this.carsInRace.push(newCar);
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
        await this.updateView();
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

    async startRace() {
        this.winnerName?.setTextContent('New Winner is...');
        await Promise.all(this.carsInRace.map((car) => car.engineSwitch()));
        console.log('cars engine switch done');
        console.log('starting race!!!!');
        try {
            const racePromises = this.carsInRace.map((car) =>
                car.driveMode().then((result) => ({ car, result }))
            );
            const { car, result } = await Promise.any(racePromises);
            if (result === 200) {
                this.winnerCar = car;
                car.incrementWins();
                this.updateWinner();
                this.setWinner();
                console.log('first successful race', car);
            }
        } catch (error) {
            console.error('Error during the race:', error);
        }
    }

    async resetRace() {
        await Promise.all(this.carsInRace.map((car) => car.engineSwitch()));
    }

    updateWinner() {
        this.winnerName?.setTextContent(
            `Car ${this.winnerCar?.Name} wins the race!!!`
        );
    }

    // eslint-disable-next-line class-methods-use-this
    async setWinner() {
        console.log('setWinner');
        console.log(this.winnerCar?.raceTime);
    }

    private createGarageView() {
        this.winnerName = p('winner-name', ' ');

        this.btnStartRace = button('start-race', 'Start Race', async () => {
            await this.startRace();
        });
        this.btnResetRace = button('reset-race', 'Reset Race', async () => {
            await this.resetRace();
        });

        const content = div(
            'garage-container',
            div(
                'config',
                input('color-car', 'color'),
                input('name-car', 'text', 'add car name'),
                button('add-car', 'Add Car', async () => {
                    await this.handleAddCar();
                }),
                button('update-car', 'Update selected', async () => {
                    await this.handleUpdateCar();
                }),
                button('generate-car', 'Add 100 cars', async () => {
                    await this.createRandomCars();
                }),
                this.btnStartRace,
                this.btnResetRace,

                this.winnerName
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
}

export default Garage;
