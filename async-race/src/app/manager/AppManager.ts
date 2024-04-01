import mainPageView from '../page/main/main-page-view';
import Garage from '../components/garage/Garage';
import Winners from '../components/winers/Winners';

class AppManager {
    root: HTMLElement | null = document.querySelector('#root');

    mainPageView = mainPageView();

    mainContainer;

    private garage;

    private winners;

    buttonGarage;

    buttonWinners;

    constructor() {
        this.mainContainer = this.mainPageView.map.get('main');
        this.buttonGarage = this.mainPageView.map.get('btn-garage');
        this.buttonWinners = this.mainPageView.map.get('btn-winners');
        this.garage = new Garage();
        this.winners = new Winners();
    }

    renderGarage() {
        if (!this.mainContainer) {
            console.error('Garage container not found');
            return;
        }
        this.mainContainer.deleteChildren();
        this.garage = new Garage();
        this.mainContainer.append(this.garage.view.element);
    }

    renderWinners() {
        if (!this.mainContainer) {
            console.error('Garage container not found');
            return;
        }
        this.mainContainer.deleteChildren();
        this.winners = new Winners();
        this.mainContainer.append(this.winners.view.element);
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
        // this.renderGarage();
        this.renderWinners();
        this.buttonGarage?.addListener('click', () => this.renderGarage());
        this.buttonWinners?.addListener('click', () => this.renderWinners());
    }
}

export default AppManager;
