import './main-page.scss';
import { div, h1, nav } from '../components/BaseComponents';

const mainPage = () => {
    const content = div(
        'container-fluid p-0 background-body',
        div(
            'app-content',
            nav(
                'app-nav navbar navbar-expand-lg bg-body-black',
                h1('app-title', 'Async-race')
            ),
            div('app-garage')
        )
    );
    return { element: content.getElement(), map: content.getAllChildrenMap() };
};

export default mainPage;
