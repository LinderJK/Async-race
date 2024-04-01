import './winners.scss';
import { div, h1, p } from '../../page/components/BaseComponents';
import type { IComponent, PageView } from '../../types/components-types';
import type { WinnerData } from '../../types/data-types';
import LoaderWin from '../../services/winner-loader';

class Winners {
    view: PageView;

    table: IComponent | undefined = undefined;

    constructor() {
        this.view = this.createView();
        this.updateView();
    }

    // eslint-disable-next-line class-methods-use-this
    async updateView() {
        this.table?.deleteChildren();
        const winners: IComponent[] = [];
        const data = await LoaderWin.getWinners();
        console.log(data, 'WINNERS');
        data.forEach((elem: WinnerData) => {
            console.log(elem);
            const winner = this.drawWinner(elem);
            winners.push(winner);
        });
        this.table?.appendChildren(winners);
    }

    // eslint-disable-next-line class-methods-use-this
    drawWinner(data: WinnerData) {
        const { id, wins, time } = data;

        const tableElem = div(
            'table-elem',
            p('elem-text', `${id} ${wins} ${time}`)
        );
        return tableElem;
    }

    // eslint-disable-next-line class-methods-use-this
    createView() {
        this.table = div('winners-table');
        const content = div(
            'winners-container',
            h1('winners-title', 'Winners'),
            this.table
        );

        return {
            element: content,
            map: content.getAllChildrenMap(),
        };
    }
}

export default Winners;
