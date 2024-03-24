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

export interface InputComponent extends IComponent {
    getValue(): string;
}

export type ComponentsMap = Map<string, IComponent> | undefined;

export type HandlerFn = (evt: Event) => void;

export interface IApplication {
    view: IAppView;
    app?: IApplication;
    controller: IAppLoader;

    start(): void;

    // getApplication(): IApplication;
}

export interface IAppView {
    root: HTMLElement | null;
    mainPage: {
        element: HTMLElement;
        map: Map<string, IComponent>;
    };

    drawGarage(data: CarsData): void;

    buildPage(): void;
}

export interface IAppLoader {
    load(callback: CallbackFunction): Promise<void>;

    addCar(name: string, color: string): Promise<CarData>;
}

export type CarData = {
    name: string;
    color: string;
    id: number;
};

export type CarsData = Array<CarData>;

export type CallbackFunction = (data: ResponseData) => void;

export type ResponseData = CarsData;

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
