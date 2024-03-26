import AppManager from './manager/AppManager';

class App {
    static app: App;

    manager: AppManager;

    constructor() {
        App.app = this;
        this.manager = new AppManager();
    }

    start() {
        this.manager.start();
    }

    static getApplication() {
        return App.app;
    }
}

export default App;
