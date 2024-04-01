import { div, h1, nav } from '../../page/components/BaseComponents';
import type { PageView } from '../../types/components-types';

class Winners {
    view: PageView;

    constructor() {
        this.view = this.createView();
    }

    // eslint-disable-next-line class-methods-use-this
    createView() {
        const content = div(
            'container-fluid p-0 app-container',
            div(
                'app-content',
                nav(
                    'app-nav navbar navbar-expand-lg bg-body-black mx-2',
                    h1('app-title', 'Async-race')
                ),
                div('main')
            )
        );
        return {
            element: content,
            map: content.getAllChildrenMap(),
        };
    }
}

export default Winners;
