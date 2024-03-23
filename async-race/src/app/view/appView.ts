import mainPage from '../pages/main/main-page';

export default class AppView {
    root: HTMLElement = document.querySelector('#root')!; // The root element of the application

    mainPage = mainPage(); // The object representing the main page

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

    public buildPage(name = 'mainPage'): void {
        this.clearPage();
        switch (name) {
            case 'mainPage':
                this.root.append(this.mainPage.element);
                console.log(this.mainPage.map);
                break;
            default:
                break;
        }
    }
}
