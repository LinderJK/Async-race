import mainPage from '../page/main/main-page';
import { CarsData, IAppLoader, ResponseData } from '../types/types';
import Garage from '../page/garage/Garage';
import Winners from '../page/winers/Winers';
import Loader from '../controller/loader';

class AppView {
    root: HTMLElement | null = document.querySelector('#root'); // The root element of the application

    mainPage = mainPage(); // The object representing the main page

    mainPageMap;

    mainDiv;

    garage;

    winners;

    private loader: IAppLoader;

    constructor() {
        this.mainPageMap = this.mainPage.map;
        this.mainDiv = this.mainPageMap.get('main');
        this.loader = new Loader();
        this.garage = new Garage(this.loader);
        this.winners = new Winners();
        this.addHandlers();
    }

    drawGarage(data: CarsData) {
        if (!this.mainDiv) {
            console.error('Garage container not found');
            return;
        }
        const garageView = this.garage.draw(data);
        this.mainDiv.append(garageView);
    }

    addHandlers() {
        console.log(this.garage.garage.map);
        console.log(this.mainPageMap);
        // const add = this.mainPageMap.get('')
    }

    clearPage(): void {
        if (!this.root) {
            console.error('dont find root');
            return;
        }
        while (this.root.firstChild) {
            this.root.removeChild(this.root.firstChild);
        }
    }

    public buildPage(): void {
        if (!this.root) {
            console.error('dont find root');
            return;
        }
        this.root.append(this.mainPage.element);
        console.log(this.mainPage.map);
        this.loader.load((data: ResponseData) => this.drawGarage(data));
    }
}

export default AppView;
