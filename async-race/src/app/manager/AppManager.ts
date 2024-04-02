import mainPageView from '../page/main/main-page-view';
import Garage from '../components/garage/Garage';
import Winners from '../components/winers/Winners';

class AppManager {
    root: HTMLElement | null = document.querySelector('#root'); // The root HTML element.

    mainPageView = mainPageView(); // Instance of the main page view.

    mainContainer; // The main container element.

    buttonGarage; // The button for navigating to the garage view.

    buttonWinners; // The button for navigating to the winners view.

    private garage; // Instance of the garage component.

    private winners; // Instance of the winners component.

    constructor() {
        this.mainContainer = this.mainPageView.map.get('main');
        this.buttonGarage = this.mainPageView.map.get('btn-garage');
        this.buttonWinners = this.mainPageView.map.get('btn-winners');
        this.garage = new Garage();
        this.winners = new Winners();
    }

    /**
     * Renders the garage view.
     * Clears the main container and appends the garage view to it.
     */
    renderGarage() {
        if (!this.mainContainer) {
            console.error('Garage container not found');
            return;
        }
        this.mainContainer.deleteChildren();
        this.garage = new Garage();
        this.mainContainer.append(this.garage.view.element);
    }

    /**
     * Renders the winners view.
     * Clears the main container and appends the winners view to it.
     */
    renderWinners() {
        if (!this.mainContainer) {
            console.error('Garage container not found');
            return;
        }
        this.mainContainer.deleteChildren();
        this.winners = new Winners();
        this.mainContainer.append(this.winners.view.element);
    }

    /**
     * Clears the root HTML element by removing all its child nodes.
     */
    clearRoot(): void {
        if (!this.root) {
            console.error('dont find root');
            return;
        }
        while (this.root.firstChild) {
            this.root.removeChild(this.root.firstChild);
        }
    }

    /**
     * Starts the application.
     * Appends the main page view to the root element.
     * Renders the garage view by default.
     * Sets up event listeners for navigation buttons.
     */
    public start(): void {
        if (!this.root) {
            console.error('dont find root');
            return;
        }
        this.root.append(this.mainPageView.element);
        this.renderGarage();
        // this.renderWinners();
        this.buttonGarage?.addListener('click', () => this.renderGarage());
        this.buttonWinners?.addListener('click', () => this.renderWinners());
        this.setupObserver();
    }

    setupObserver() {
        document.addEventListener('deleteCar', (e) => {
            this.garage.deleteCarHandler();
            Winners.deleteWinnerHandler(e);
        });
        document.addEventListener('selectCar', this.garage.selectCarHandler);
        document.addEventListener('endRace', Winners.endRaceHandler);
    }
}

export default AppManager;
