import './car.scss';
import { CarData, CarParams } from '../../types/data-types';
import { button, div, image, p } from '../../page/components/BaseComponents';
import FlagSvg from '../../../assets/flag.svg';
import CarSvg from '../../../assets/car.svg';
import { ComponentMap, IComponent } from '../../types/components-types';
import Loader from '../../services/loader';
import Button from '../../page/components/button/button';
import ObjectComponent from '../../page/components/object/object';

class Car {
    id: number; // Unique identifier for the car.

    color: string; // Color of the car.

    name: string; // Name of the car.

    params: CarParams = { velocity: 0, distance: 0 }; // Parameters related to the car.

    nextEngineStatus: 'started' | 'stopped' = 'started'; // Indicates the next engine status.

    isEngineOn: boolean = false; // Indicates whether the engine is currently on.

    btnStartEngine: Button | undefined = undefined; // Button for starting the engine.

    btnStopEngine: Button | undefined = undefined; // Button for stopping the engine.

    componentMap: ComponentMap; // Map of components associated with the car view.

    carSvgObj; // SVG object representing the car image.

    view: IComponent; // Car view component.

    carImage: IComponent | undefined = undefined; // Component representing the car image.

    flagImage: IComponent | undefined = undefined; // Component representing the flag image.

    carContainer: IComponent | undefined = undefined; // The container of the car.

    isAnimation: boolean = false; // Indicates whether the animation is active.

    private timeInRace: number = 0; // Time spent by the car in the race.

    private winsCount: number = 0; // Number of wins achieved by the car.

    constructor(data: CarData) {
        this.id = data.id;
        this.color = data.color;
        this.name = data.name;
        this.carSvgObj = this.createSvg();
        this.view = this.createView();
        this.componentMap = this.view.getAllChildrenMap();
    }

    /**
     * Creates an SVG object for the cars image.
     * Sets the color of the SVG based on the cars color property.
     * @returns {ObjectComponent} The created SVG object component.
     */
    createSvg() {
        const objectElement = document.createElement('object');

        objectElement.setAttribute('type', 'image/svg+xml');
        objectElement.setAttribute('data', `${CarSvg}`);
        objectElement.setAttribute('width', '100%');
        objectElement.setAttribute('height', '100%');

        objectElement.onload = () => {
            const svgDoc = objectElement.contentDocument;
            const path = svgDoc!.getElementById('path3155');
            path!.setAttribute('fill', `${this.color}`);
        };
        return new ObjectComponent(objectElement);
    }

    /**
     * Dispatches a custom event indicating that the car has been selected.
     */
    select() {
        const selectCarEvent = new CustomEvent('selectCar', {
            detail: { selectedCar: this },
        });
        document.dispatchEvent(selectCarEvent);
    }

    /**
     * Deletes the car asynchronously.
     * Dispatches an event indicating that the car has been deleted.
     */
    async delete() {
        try {
            await Loader.deleteCar(this.id);
            document.dispatchEvent(new Event('deleteCar'));
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Toggles the engine status of the car asynchronously.
     * Updates the engine status and UI elements accordingly.
     */
    async engineSwitch() {
        this.params = await Loader.toggleEngine(this.id, this.nextEngineStatus);

        if (this.nextEngineStatus === 'started') {
            this.nextEngineStatus = 'stopped';
            this.isEngineOn = true;
        } else if (this.nextEngineStatus === 'stopped') {
            this.nextEngineStatus = 'started';
            this.isEngineOn = false;
            this.carImage?.addStyle({
                transform: `translateX(${0}px)`,
            });
            this.btnStartEngine?.deleteAttribute('disabled');
            this.btnStopEngine?.setAttributes({ disabled: true });
        }
    }

    /**
     * Initiates the drive mode for the car asynchronously.
     * Animates the cars movement during the drive mode.
     * @returns {Promise<number>} A promise resolving to the drive status after completion.
     * If an error occurs, the promise is rejected with the error status.
     */
    async driveMode() {
        if (!this.isEngineOn) {
            console.error('Need to start engine');
        }

        this.isAnimation = true;
        await this.animate();

        this.btnStartEngine?.setAttributes({ disabled: true });

        let driveStatus;

        try {
            driveStatus = await Loader.switchToDriveMode(this.id);
        } catch (error) {
            this.isAnimation = false;
            return Promise.reject(driveStatus);
        }

        return driveStatus;
    }

    /**
     * Calculates the width of the car container during the race.
     * @returns {number} The calculated width of the car container.
     */
    calcContainerRaceWidth(): number {
        let width: number = 0;
        const carContainerWidth = this.carContainer?.getWidth();
        const flagImageWidth = this.flagImage?.getWidth();
        const navCarWidth =
            this.componentMap!.get('car-view__control')?.getWidth() || 0;
        const carImageWidth = this.carImage?.getWidth() || 0;

        if (
            typeof carContainerWidth === 'number' &&
            typeof flagImageWidth === 'number'
        ) {
            width =
                carContainerWidth -
                flagImageWidth -
                navCarWidth -
                carImageWidth / 2;
        } else {
            console.error('Error calculating car container width');
        }
        return width;
    }

    /**
     * Animates the cars movement during the race.
     */
    animate() {
        const width = this.calcContainerRaceWidth();
        const start = performance.now();
        const totalTime = this.params.distance / this.params.velocity;

        const animateStep = (timestamp: DOMHighResTimeStamp) => {
            const progress = timestamp - start;
            if (!this.isAnimation) {
                this.timeInRace = progress;
                return;
            }

            const distanceMoved = (progress / totalTime) * width;
            this.carImage?.addStyle({
                transform: `translateX(${distanceMoved}px)`,
            });

            if (distanceMoved < width) {
                requestAnimationFrame(animateStep);
            } else {
                this.isAnimation = false;
                this.timeInRace = progress;
            }
        };
        requestAnimationFrame(animateStep);
    }

    createView() {
        this.btnStartEngine = button('btn-start-engine', 'A', async () => {
            await this.engineSwitch();
            try {
                await this.driveMode();
            } catch (e) {
                console.log(e);
            }
            this.btnStopEngine!.deleteAttribute('disabled');
        });
        this.btnStopEngine = button('btn-start-drive', 'B', async () => {
            await this.engineSwitch();
        });
        this.btnStopEngine.setAttributes({ disabled: true });

        this.carImage = div('car-image', this.carSvgObj);
        this.flagImage = div(
            'flag-image',
            image('flag-image', FlagSvg, 'flag-svg')
        );

        this.carContainer = div(
            'car-view__draw',
            this.carImage,
            this.flagImage
        );

        const carView = div(
            'car',
            div(
                'car__nav',
                button('nav__select-car button-select', 'Select', async () => {
                    await this.select();
                }),
                button('nav__remove-car button-remove', 'Remove', async () => {
                    await this.delete();
                }),
                p('nav__name-car', `${this.name}`)
            ),
            div(
                'car-view my-2',
                div(
                    'car-view__control',
                    this.btnStartEngine,
                    this.btnStopEngine
                ),
                this.carContainer
            )
        );
        carView.setAttributes({ id: `${this.id}` });

        return carView;
    }

    get Id() {
        return this.id;
    }

    set Id(id: number) {
        this.id = id;
    }

    get Name() {
        return this.name;
    }

    set Name(name: string) {
        this.name = name;
    }

    get Color() {
        return this.color;
    }

    set Color(color: string) {
        this.color = color;
    }

    get raceTime(): number {
        return this.timeInRace;
    }

    incrementWins(): void {
        this.winsCount += 1;
    }

    get winsNumbers() {
        return this.winsCount;
    }
}

export default Car;
