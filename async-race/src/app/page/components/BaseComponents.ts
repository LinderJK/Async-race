import Button from './button/button';
import type { HandlerFn, IComponent } from '../../types/types';
import Component from './Component';
import Input from './input/input';
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
