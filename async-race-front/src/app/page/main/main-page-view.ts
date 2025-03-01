import './main-page.scss';
import { button, div, h1, nav } from '../components/BaseComponents';

const mainPageView = () => {
    const content = div(
        'container-fluid p-0 app-container',
        div(
            'app-content',
            nav(
                'app-nav navbar justify-content-start mx-2',
                h1('app-title flex-grow-1', 'Async-race'),
                button('btn-winners mx-2', 'To Winners', () => {}),
                button('btn-garage mx-2', 'To Garage', () => {})
            ),
            div('main')
        )
    );
    return { element: content.getElement(), map: content.getAllChildrenMap() };
};

export default mainPageView;
