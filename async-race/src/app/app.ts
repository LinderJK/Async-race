import AppView from './view/appView';

class App {
    static app: App;

    view: AppView;

    constructor() {
        App.app = this;
        this.view = new AppView();
    }

    start() {
        this.view.buildPage();
    }

    static getApplication() {
        return App.app;
    }
}

export default App;
