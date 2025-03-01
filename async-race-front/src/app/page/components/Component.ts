import { IComponent } from '../../types/components-types';

interface IComponentConstructor {
    tagName?: keyof HTMLElementTagNameMap | string;
    className?: string;
    textContent?: string;
    attributes?: {
        [key: string]: string;
    };
    children?: IComponent;
}

class Component implements IComponent {
    elem: HTMLElement;

    children: IComponent[] = [];

    constructor(
        {
            tagName = 'div',
            className = '',
            textContent = '',
            attributes = {},
        }: IComponentConstructor,
        ...children: IComponent[]
    ) {
        const element = document.createElement(tagName);
        element.className = className;
        element.textContent = textContent;
        this.elem = element;

        if (attributes) {
            this.setAttributes(attributes);
        }
        if (children) {
            this.appendChildren(children);
        }
    }

    setTextContent(textContent: string): void {
        this.elem.textContent = textContent;
    }

    getTextContent(): string {
        if (this.elem.textContent) {
            return this.elem.textContent;
        }
        console.error('no text content');
        return '';
    }

    deleteAttribute(attribute: string): void {
        this.elem.removeAttribute(attribute);
    }

    setAttributes(attributes: { [x: string]: string | boolean }) {
        if (attributes && this.elem) {
            Object.keys(attributes).forEach((key) => {
                const value = attributes[key];
                if (typeof value === 'boolean') {
                    this.elem.setAttribute(key, '');
                } else {
                    this.elem.setAttribute(key, value);
                }
            });
        }
    }

    appendChildren(childrenArr: IComponent[]) {
        childrenArr.forEach((element: IComponent) => this.append(element));
    }

    append(element: IComponent) {
        this.children.push(element);
        this.elem?.append(element.getElement());
    }

    getElement() {
        return this.elem;
    }

    addListener(
        event: keyof HTMLElementEventMap,
        listener: EventListener,
        options = false
    ) {
        this.elem.addEventListener(event, listener, options);
    }

    removeListener(
        event: keyof HTMLElementEventMap,
        listener: EventListener,
        options = false
    ) {
        this.elem.removeEventListener(event, listener, options);
    }

    deleteChildren() {
        this.children.forEach((child) => {
            child.delete();
        });
        this.children.length = 0;
    }

    deleteChild(child: IComponent) {
        const index = this.children.indexOf(child);
        if (index !== -1) {
            this.children.splice(index, 1);
            child.elem.remove();
        }
    }

    getAllChildrenMap(): Map<string, IComponent> {
        const allChildrenMap: Map<string, IComponent> = new Map();

        const setChildren = (element: IComponent) => {
            const key = element.elem.className.split(' ')[0];
            allChildrenMap.set(key, element);
            element.children.forEach((child: IComponent) => setChildren(child));
        };
        this.children.forEach((child) => setChildren(child));
        return allChildrenMap;
    }

    delete() {
        this.deleteChildren();
        this.elem.remove();
    }

    addStyle(styles: { [key: string]: string }) {
        const elemStyle = this.elem.style as CSSStyleDeclaration;
        Object.keys(styles).forEach((property) => {
            elemStyle.setProperty(property, styles[property]);
        });
    }

    getWidth() {
        return this.elem.clientWidth;
    }

    toggleClass(name: string) {
        this.elem.classList.toggle(name);
    }
}

export default Component;
