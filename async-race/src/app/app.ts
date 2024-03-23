import AppView from './view/appView';
import AppController from './controller/appController';
import { ResponseData } from './types/types';

class App {
    static app: App;

    view: AppView;

    controller: AppController;

    constructor() {
        App.app = this;
        this.view = new AppView();
        this.controller = new AppController();
    }

    start() {
        this.view.buildPage();
        this.controller.load((data: ResponseData) =>
            this.view.drawGarage(data)
        );
    }

    static getApplication() {
        return App.app;
    }
}

export default App;
