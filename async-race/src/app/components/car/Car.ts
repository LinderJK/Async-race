import './car.scss';
import { CarData, CarParams } from '../../types/data-types';
import { button, div, image, p } from '../../page/components/BaseComponents';
import CarSvg from '../../../assets/car.svg';
import FlagSvg from '../../../assets/flag.svg';
import { ComponentMap, IComponent } from '../../types/components-types';
import Loader from '../../services/loader';
import Button from '../../page/components/button/button';

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

    carImage: IComponent | undefined;

    view: IComponent;

    constructor(data: CarData) {
        this.id = data.id;

        this.color = data.color;
        this.name = data.name;
        this.view = this.createView();
    }

    select() {
        // const car = await Loader.getCar(this.id);
        // document.dispatchEvent(new Event('selectCar'));
        const selectCarEvent = new CustomEvent('selectCar', {
            detail: { selectedCar: this },
        });
        document.dispatchEvent(selectCarEvent);
        // console.log(car);
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
            this.btnStartEngine?.toggleClass('btn-start-engine--sucsess');
        } else if (this.nextEngineStatus === 'stopped') {
            this.params = await Loader.toggleEngine(
                this.id,
                this.nextEngineStatus
            );
            this.nextEngineStatus = 'started';
            this.btnStartEngine?.toggleClass('btn-start-engine--sucsess');
        }
    }

    // eslint-disable-next-line class-methods-use-this
    createView() {
        this.btnStartEngine = button('btn-start-engine', 'A', () =>
            this.engineSwitch()
        );
        this.btnStartDrive = button('btn-start-drive', 'B', () => {
            console.log('start drive');
            // this.startDrive();
        });
        const car = div(
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
                div(
                    'car-view__draw',
                    div('car-image', image('image', CarSvg, 'car-svg')),
                    div('flag-image', image('flag-image', FlagSvg, 'flag-svg'))
                )
            )
        );
        car.setAttributes({ id: `${this.id}` });
        // car.setTextContent(`${name}, ${id},   ${color}`);
        return car;
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
