import mainPageView from '../page/main/main-page-view';
import Garage from '../components/garage/Garage';
import Winners from '../components/winers/Winers';

class AppManager {
    root: HTMLElement | null = document.querySelector('#root');

    mainPageView = mainPageView();

    mainContainer;

    private garage;

    private winners;

    // private readonly loader: ILoader;

    constructor() {
        this.mainContainer = this.mainPageView.map.get('main');
        // this.loader = new Loader();
        this.garage = new Garage();
        this.winners = new Winners();
    }

    renderGarage() {
        if (!this.mainContainer) {
            console.error('Garage container not found');
            return;
        }
        this.mainContainer.append(this.garage.view.element);
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
        this.renderGarage();
    }
}

export default AppManager;
