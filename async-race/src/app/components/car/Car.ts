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
    id: number;

    color: string;

    name: string;

    params: CarParams = { velocity: 0, distance: 0 };

    nextEngineStatus: 'started' | 'stopped' = 'started';

    isEngineOn: boolean = false;

    btnStartEngine: Button | undefined = undefined;

    btnStartDrive: Button | undefined = undefined;

    componentMap: ComponentMap;

    carSvgObj;

    view: IComponent;

    carImage: IComponent | undefined = undefined;

    flagImage: IComponent | undefined = undefined;

    carContainer: IComponent | undefined = undefined;

    constructor(data: CarData) {
        this.id = data.id;
        this.color = data.color;
        this.name = data.name;
        this.carSvgObj = this.createSvg();
        this.view = this.createView();
        this.componentMap = this.view.getAllChildrenMap();

        console.log(this.view, this.carSvgObj, 'OBJECT');
    }

    // calcContainerWidth() {
    //     // if (this.carContainer) {
    //     //     console.log(this.carContainer.getWidth(), 'OffsetWidth');
    //     //     console.log(this.carContainer);
    //     //     return 1;
    //     // }
    //     // return 1;
    //     // const width = document.querySelector('');
    // }

    createSvg() {
        const objectElement = document.createElement('object');
        objectElement.setAttribute('type', 'image/svg+xml');
        objectElement.setAttribute('data', `${CarSvg}`);
        objectElement.setAttribute('width', '100%');
        objectElement.setAttribute('height', '100%');

        console.log(objectElement);

        objectElement.onload = () => {
            const svgDoc = objectElement.contentDocument;
            const path = svgDoc!.getElementById('path3155');

            path!.setAttribute('fill', `${this.color}`);
        };
        return new ObjectComponent(objectElement);
    }

    select() {
        const selectCarEvent = new CustomEvent('selectCar', {
            detail: { selectedCar: this },
        });
        document.dispatchEvent(selectCarEvent);
    }

    async delete() {
        try {
            await Loader.deleteCar(this.id);
            document.dispatchEvent(new Event('deleteCar'));
        } catch (error) {
            console.error(error);
        }
    }

    async engineSwitch() {
        if (this.nextEngineStatus === 'started') {
            this.params = await Loader.toggleEngine(
                this.id,
                this.nextEngineStatus
            );
            this.nextEngineStatus = 'stopped';
            this.isEngineOn = true;
            this.btnStartEngine?.toggleClass('btn-start-engine--sucsess');
        } else if (this.nextEngineStatus === 'stopped') {
            this.params = await Loader.toggleEngine(
                this.id,
                this.nextEngineStatus
            );
            this.nextEngineStatus = 'started';
            this.isEngineOn = false;
            this.btnStartEngine?.toggleClass('btn-start-engine--sucsess');
        }
    }

    private async driveMode() {
        if (!this.isEngineOn) {
            console.error('Need to start engine');
            return;
        }
        console.log('start drive');
        this.animate();
        const driveStatus = await Loader.switchToDriveMode(this.id);
        console.log(driveStatus);
        // this.animate();
    }

    private animate() {
        const carContainerWidth = this.carContainer?.getWidth();
        const flagImageWidth = this.flagImage?.getWidth();
        const navCarWidth =
            this.componentMap!.get('car-view__control')!.getWidth();
        let width: number;
        const carImageWidth = this.carImage?.getWidth()!;
        if (
            typeof carContainerWidth === 'number' &&
            typeof flagImageWidth === 'number'
        ) {
            width =
                carContainerWidth -
                flagImageWidth -
                navCarWidth -
                carImageWidth / 2;
            console.log(width);
        } else {
            console.error('Error calculating car container width');
        }

        const start = performance.now();
        const totalTime = this.params.distance / this.params.velocity;
        const animateStep = (timestamp: DOMHighResTimeStamp) => {
            const progress = timestamp - start;
            const distanceMoved = (progress / totalTime) * width;
            this.carImage?.addStyle({
                transform: `translateX(${distanceMoved}px)`,
            });
            if (distanceMoved < width) {
                requestAnimationFrame(animateStep);
            }
        };
        requestAnimationFrame(animateStep);
    }

    createView() {
        this.btnStartEngine = button('btn-start-engine', 'A', () =>
            this.engineSwitch()
        );
        this.btnStartDrive = button('btn-start-drive', 'B', () => {
            // console.log('start drive');
            this.driveMode();
        });

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
                button('nav__select-car button-select', 'Select', () => {
                    this.select();
                }),
                button('nav__remove-car button-remove', 'Remove', () => {
                    this.delete();
                }),
                p('nav__name-car', `${this.name}`)
            ),
            div(
                'car-view my-2',
                div(
                    'car-view__control',
                    this.btnStartEngine,
                    this.btnStartDrive
                ),
                // div(
                //     'car-view__draw',
                //     this.carImage,
                //     div('flag-image', image('flag-image', FlagSvg, 'flag-svg'))
                // ),
                this.carContainer
                // image('image', ``, 'car-svg')
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
}

export default Car;
