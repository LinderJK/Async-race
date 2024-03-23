import mainPage from '../page/main/main-page';
import { CarData } from '../types/types';
import Garage from '../page/garage/Garage';
import Winners from '../page/winers/Winers';

class AppView {
    root: HTMLElement | null = document.querySelector('#root'); // The root element of the application

    mainPage = mainPage(); // The object representing the main page

    mainPageMap;

    appGarageDiv;

    garage;

    winners;

    constructor() {
        this.garage = new Garage();
        this.winners = new Winners();
        this.mainPageMap = this.mainPage.map;
        this.appGarageDiv = this.mainPageMap.get('app-garage');
    }

    drawGarage(data: CarData) {
        if (!this.appGarageDiv) {
            console.error('Garage container not found');
            return;
        }
        this.garage.draw(data, this.appGarageDiv);
    }

    // drawWinders() {}

    /**
     * Clears the content of the root element.
     */
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
    }

    getMainPageMap() {
        return this.mainPage.map;
    }
}

export default AppView;
