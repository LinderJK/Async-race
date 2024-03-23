export interface IComponent {
    element: HTMLElement;
    children: IComponent[];

    getElement(): HTMLElement;

    delete(): void;

    deleteChildren(): void;

    deleteChild(child: IComponent): void;

    setAttributes(attributes: { [x: string]: string | boolean }): void;

    append(element: IComponent): void;

    removeAttribute(attribute: string): void;

    getTextContent(): string;

    getAllChildrenMap(): Map<string, IComponent>;

    appendChildren(children: IComponent[]): void;

    addListener(
        event: keyof HTMLElementEventMap,
        listener: EventListener,
        options?: boolean
    ): void;

    removeListener(
        event: keyof HTMLElementEventMap,
        listener: EventListener,
        options?: boolean
    ): void;

    setTextContent(textContent: string): void;
}

export type PageMap = Map<string, IComponent | undefined> | undefined;

export type HandlerFn = (evt: Event) => void;

export interface IApplication {
    view: IAppView;
    app?: IApplication;
    controller: IAppController;

    start(): void;

    // getApplication(): IApplication;
}

export interface IAppView {
    root: HTMLElement | null;
    mainPage: {
        element: HTMLElement;
        map: Map<string, IComponent>;
    };

    drawGarage(data: CarData): void;

    buildPage(): void;
}

export interface IAppController {
    app: IApplication;
    garageData: CarData;

    getGarage(): CarData;

    start(): void;
}

export type CarData = {
    name: string;
    color: string;
    id: number;
}[];

export type CallbackFunction = (data: ResponseData) => void;

export type ResponseData = CarData;

export enum RequestMethod {
    GET = 0,
    POST,
    PUT,
    DELETE,
    PATCH,
    ALL,
    OPTIONS,
    HEAD,
    SEARCH,
}
