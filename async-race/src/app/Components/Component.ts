import { IComponent } from '../types/types';

interface IComponentConstructor {
    tagName?: keyof HTMLElementTagNameMap | string;
    className: string;
    textContent?: string;
    attributes?: {
        [key: string]: string;
    };
    children?: IComponent;
}

class Component implements IComponent {
    element: HTMLElement;

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
        this.element = element;

        if (attributes) {
            this.setAttributes(attributes);
        }
        if (children) {
            this.appendChildren(children);
        }
    }

    setTextContent(textContent: string): void {
        this.element.textContent = textContent;
    }

    getTextContent(): string {
        if (this.element.textContent) {
            return this.element.textContent;
        }
        console.error('no text content');
        return '';
    }

    removeAttribute(attribute: string): void {
        this.element.removeAttribute(attribute);
    }

    setAttributes(attributes: { [x: string]: string | boolean }) {
        if (attributes && this.element) {
            Object.keys(attributes).forEach((key) => {
                const value = attributes[key];
                if (typeof value === 'boolean') {
                    this.element.setAttribute(key, '');
                } else {
                    this.element.setAttribute(key, value);
                }
            });
        }
    }

    appendChildren(childrenArr: IComponent[]) {
        childrenArr.forEach((element: IComponent) => this.append(element));
    }

    append(element: IComponent) {
        this.children.push(element);
        this.element?.append(element.getElement());
    }

    getElement() {
        return this.element;
    }

    addListener(
        event: keyof HTMLElementEventMap,
        listener: EventListener,
        options = false
    ) {
        this.element.addEventListener(event, listener, options);
    }

    removeListener(
        event: keyof HTMLElementEventMap,
        listener: EventListener,
        options = false
    ) {
        this.element.removeEventListener(event, listener, options);
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
            child.element.remove();
        }
    }

    getAllChildrenMap(): Map<string, IComponent> {
        const allChildrenMap: Map<string, IComponent> = new Map();

        const setChildren = (element: IComponent) => {
            const key = element.element.className.split(' ')[0];
            allChildrenMap.set(key, element);
            element.children.forEach((child: IComponent) => setChildren(child));
        };
        this.children.forEach((child) => setChildren(child));
        return allChildrenMap;
    }

    delete() {
        this.deleteChildren();
        this.element.remove();
    }
}

export default Component;
