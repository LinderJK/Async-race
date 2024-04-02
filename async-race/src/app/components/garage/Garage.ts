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
    view: PageView; // View of the garage page.

    inputs: ComponentMap; // The input fields of the garage.

    carList: IComponent | undefined = undefined; // Represents a container the cars in the garage.

    title: IComponent | undefined = undefined; // Represents the garage title.

    winnerName: IComponent | undefined = undefined; // Represents the name of the winner of the race.

    btnStartRace: IComponent | undefined = undefined; // Represents the 'Start Race' button.

    btnResetRace: IComponent | undefined = undefined; // Represents the 'Reset Race' button.

    carsData: CarsData = []; // Represents the data of cars in the garage.

    carsInRace: Car[] = []; // The cars participating in the race.

    carsNumbers: number = 0; // The number of cars in the garage.

    currentCar: Car | undefined = undefined; // Represents the current selected car.

    currentPage = 1; // Represents the current page number.

    carsPerPage = 7; // Represents the number of cars per page.

    carsToCreate = 100; // Represents the number of cars to create.

    winnerCar: Car | undefined = undefined; // Represents the winner car of the race.

    constructor() {
        this.view = this.createGarageView();
        if (!this.view.map) {
            console.error('Could not obtain garage view map');
            return;
        }
        this.inputs = this.view.map.get('config')?.getAllChildrenMap();
        this.carList = this.view.map.get('car-list');
        this.title = this.view.map.get('garage-title');

        this.updateView();
        this.updatePaginationButtons();
    }

    /**
   * Handler function for delete a car.

   */
    deleteCarHandler = async () => {
        await this.updateView();
    };

    /**
     * Handler function for select a car.
     */
    selectCarHandler: EventListener = (event: Event) => {
        const customEvent = event as CustomEvent;
        const { selectedCar } = customEvent.detail;
        this.currentCar = selectedCar;
        this.inputs
            ?.get('color-car')
            ?.setAttributes({ value: `${this.currentCar?.Color}` });
        this.inputs
            ?.get('name-car')
            ?.setAttributes({ value: `${this.currentCar?.Name}` });
    };

    /**
     * Asynchronously updates the view of the garage.
     * Fetches the latest garage data using Loader.loadGarageData,
     * updates the display with the retrieved data, and updates pagination buttons.
     */
    async updateView() {
        const data = await Loader.loadGarageData();
        this.carsInRace = [];
        this.carsData = data;

        this.carsNumbers = this.carsData.length;

        const startIndex = (this.currentPage - 1) * this.carsPerPage;
        const endIndex = startIndex + this.carsPerPage;
        const carsToShow = this.carsData.slice(startIndex, endIndex);

        if (this.title) {
            this.title.setTextContent(`Garage ${this.carsNumbers}`);
        }

        this.carList?.deleteChildren();

        this.drawCars(carsToShow);
        this.updatePaginationButtons();
    }

    /**
     * Updates pagination buttons based on current page and total number of pages.
     * Calculates the total number of pages based on the length of carsData and carsPerPage.
     * Generates 'Prev' and 'Next' buttons to navigate between pages.
     * Updates currentPage when 'Prev' or 'Next' button is clicked and calls updateView asynchronously.
     */
    updatePaginationButtons() {
        const totalPages = Math.ceil(this.carsData.length / this.carsPerPage);
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
    }

    /**
     * Draws cars based on the provided carsData array.
     * Iterates over each car in the array, creates a new Car object, appends its view to the carList,
     * and adds the car to the carsInRace array.
     * @param {CarsData} carsData The array of car data to be drawn.
     */
    private drawCars(carsData: CarsData) {
        carsData.forEach((car) => {
            const newCar = new Car(car);
            this.carList?.append(newCar.view);
            this.carsInRace.push(newCar);
        });
    }

    /**
     * Asynchronously handles the addition of a new car.
     * Retrieves color and name input values, validates inputs,
     * and attempts to add a new car via Loader.addCar.
     */
    async handleAddCar() {
        const colorInput = this.inputs?.get('color-car') as IInput;
        const nameInput = this.inputs?.get('name-car') as IInput;

        const color = colorInput.getValue();
        const name = nameInput.getValue();

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
        } catch (error) {
            console.error('Error creating car:', error);
        }
        await this.updateView();
    }

    /**
     * Asynchronously handles the update a car.
     * Retrieves color and name input values, validates inputs,
     * and attempts to update the current cars data via Loader.updateCar.
     */
    async handleUpdateCar() {
        const colorInput = this.inputs?.get('color-car') as IInput;
        const nameInput = this.inputs?.get('name-car') as IInput;

        const color = colorInput.getValue();
        const name = nameInput.getValue();

        if (!colorInput || !nameInput || !this.carList || !this.currentCar) {
            console.error('error color input is not valid');
            return;
        }

        try {
            await Loader.updateCar(this.currentCar.id, name, color);
        } catch (error) {
            console.error('Error update car:', error);
        }

        await this.updateView();
    }

    /**
     * Asynchronously creates random cars and adds them to the garage.
     * Generates a specified number of random cars with random colors and names.
     * Adds each generated car to the garage via Loader.addCar asynchronously.
     */
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
                await Loader.addCar(car.name, car.color);
            } catch (error) {
                console.error('Error creating car:', error);
            }
        });

        await Promise.all(promises);
        await this.updateView();
    }

    /**
     * Asynchronously starts the race.
     * Resets the winner name display.
     * Activates the engine for each car participating in the race.
     * Initiates the drive mode for each car concurrently.
     * Updates the winner's statistics and displays.
     */
    async startRace() {
        this.winnerName?.setTextContent('New Winner is...');

        await Promise.all(this.carsInRace.map((car) => car.engineSwitch()));

        try {
            const racePromises = this.carsInRace.map((car) =>
                car.driveMode().then((result) => ({ car, result }))
            );
            const { car, result } = await Promise.any(racePromises);
            if (result === 200) {
                this.winnerCar = car;
                car.incrementWins();
                this.raceEnd();
            }
        } catch (error) {
            console.error('Error during the race:', error);
        }
    }

    /**
     * Turns off the engine for each car participating in the race.
     */
    async resetRace() {
        await Promise.all(this.carsInRace.map((car) => car.engineSwitch()));
    }

    /**
     * Handles the end of the race.
     * Sets the winner name and dispatches an 'endRace' event with the winning car details.
     */
    private raceEnd() {
        this.winnerName?.setTextContent(
            `Car ${this.winnerCar?.Name} wins the race!!!`
        );
        if (this.winnerCar) {
            const endRaceEvent = new CustomEvent('endRace', {
                detail: { winnerCar: this.winnerCar },
            });
            document.dispatchEvent(endRaceEvent);
        }
    }

    /**
     * Creates the view for the garage.
     * Initializes various UI elements including buttons, inputs, and text content.
     * Sets up event listeners for buttons.
     * @returns {element: IComponent, map: Map<string, IComponent>}
     * Object containing the created HTML element and its child elements map.
     */
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
