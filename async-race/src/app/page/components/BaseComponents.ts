import Button from './button/button';

import Component from './Component';
import Input from './input/input';
import { IComponent } from '../../types/components-types';
import { HandlerFn } from '../../types/data-types';
// import Input from './input/input';

export const div = (className: string, ...children: IComponent[]) =>
    new Component(
        {
            tagName: 'div',
            className,
        },
        ...children
    );

export const divText = (className: string, textContent: string) =>
    new Component({
        tagName: 'div',
        className,
        textContent,
    });
export const p = (className: string, textContent: string) =>
    new Component({
        tagName: 'p',
        className,
        textContent,
    });

export const h1 = (className: string, textContent: string) =>
    new Component({
        tagName: 'h1',
        className,
        textContent,
    });

export const button = (
    className: string,
    textContent: string,
    clickHandler: HandlerFn
) =>
    new Button({
        className,
        textContent,
        clickHandler,
    });

export const span = (className: string, textContent: string, id = '') =>
    new Component({
        tagName: 'span',
        className,
        textContent,
        attributes: { id },
    });

export const nav = (className: string, ...children: IComponent[]) =>
    new Component(
        {
            tagName: 'nav',
            className,
        },
        ...children
    );

export const input = (
    className: string,
    type: string,
    placeholder = '',
    id = ''
) =>
    new Input({
        className,
        id,
        type,
        placeholder,
    });

export const image = (
    className: string,
    src: string,
    alt: string,
    ...children: IComponent[]
) =>
    new Component(
        {
            tagName: 'img',
            className,
            attributes: {
                src,
                alt,
            },
        },
        ...children
    );

export const table = (className: string, ...children: IComponent[]) =>
    new Component(
        {
            tagName: 'table',
            className,
        },
        ...children
    );

export const thead = (...children: IComponent[]) =>
    new Component(
        {
            tagName: 'thead',
        },
        ...children
    );

export const tbody = (...children: IComponent[]) =>
    new Component(
        {
            tagName: 'tbody',
        },
        ...children
    );

export const tr = (className: string, ...children: IComponent[]) =>
    new Component(
        {
            tagName: 'tr',
            className,
        },
        ...children
    );

export const th = (className: string, textContent: string, scope: string) =>
    new Component({
        tagName: 'th',
        attributes: { scope },
        className,
        textContent,
    });

export const td = (
    className: string,
    textContent: string,
    ...children: IComponent[]
) =>
    new Component(
        {
            tagName: 'td',
            className,
            textContent,
        },
        ...children
    );
