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
