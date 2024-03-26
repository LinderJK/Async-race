import mainPageView from '../page/main/main-page-view';
import Garage from '../components/garage/Garage';
import Winners from '../components/winers/Winers';
import Loader from '../services/loader';
import { CarsData, ILoader } from '../types/data-types';

class AppManager {
    root: HTMLElement | null = document.querySelector('#root');

    mainPageView = mainPageView();

    mainContainerChildrenMap;

    private garage;

    private winners;

    private readonly loader: ILoader;

    constructor() {
        this.mainContainerChildrenMap = this.mainPageView.map.get('main');
        this.loader = new Loader();
        this.garage = new Garage(this.loader);
        this.winners = new Winners();
    }

    renderGarage(data: CarsData) {
        if (!this.mainContainerChildrenMap) {
            console.error('Garage container not found');
            return;
        }
        const garageView = this.garage.draw(data);
        this.mainContainerChildrenMap.append(garageView);
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
        this.root.append(this.mainPageView.element);
        this.loader.load().then((r) => {
            this.renderGarage(r);
        });
    }
}

export default AppManager;
