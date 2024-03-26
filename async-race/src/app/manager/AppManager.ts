import mainPage from '../page/main/main-page';
import Garage from '../components/garage/Garage';
import Winners from '../components/winers/Winers';
import Loader from '../services/loader';
import { ILoader } from '../types/components';
import { CarsData, ResponseData } from '../types/data';

class AppManager {
    root: HTMLElement | null = document.querySelector('#root');

    mainPageComponent = mainPage();

    mainPageMap;

    mainPageContainer;

    private garage;

    private winners;

    private readonly loader: ILoader;

    constructor() {
        this.mainPageMap = this.mainPageComponent.map;
        this.mainPageContainer = this.mainPageMap.get('main');
        this.loader = new Loader();
        this.garage = new Garage(this.loader);
        this.winners = new Winners();
    }

    renderGarage(data: CarsData) {
        if (!this.mainPageContainer) {
            console.error('Garage container not found');
            return;
        }
        const garageView = this.garage.draw(data);
        this.mainPageContainer.append(garageView);
    }

    clearRoot(): void {
        if (!this.root) {
            console.error('dont find root');
            return;
        }
        while (this.root.firstChild) {
            this.root.removeChild(this.root.firstChild);
        }
    }

    public start(): void {
        if (!this.root) {
            console.error('dont find root');
            return;
        }
        this.root.append(this.mainPageComponent.element);
        console.log(this.mainPageComponent.map);
        this.loader.load((data: ResponseData) =>
            this.renderGarage(data as CarsData)
        );

        console.log(this.mainPageMap);
    }
}

export default AppManager;
