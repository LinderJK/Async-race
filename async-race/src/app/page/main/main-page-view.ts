import './main-page.scss';
import { button, div, h1, nav } from '../components/BaseComponents';

const mainPageView = () => {
    const content = div(
        'container-fluid p-0 app-container',
        div(
            'app-content',
            nav(
                'app-nav navbar navbar-expand-lg bg-body-black mx-2',
                h1('app-title', 'Async-race'),
                button('btn-winners', 'To Winners', () => {}),
                button('btn-garage', 'To Garage', () => {})
            ),
            div('main')
        )
    );
    return { element: content.getElement(), map: content.getAllChildrenMap() };
};

export default mainPageView;
