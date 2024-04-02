import './winners.scss';
import {
    div,
    h1,
    table,
    tbody,
    td,
    th,
    thead,
    tr,
} from '../../page/components/BaseComponents';
import type { IComponent, PageView } from '../../types/components-types';
import type { WinnerData } from '../../types/data-types';
import Car from '../car/Car';
import WinnerLoader from '../../services/winner-loader';
import Loader from '../../services/loader';

class Winners {
    view: PageView;

    table: IComponent | undefined = undefined;

    // currentWinner: Car | undefined = undefined;

    private static currentWinner: Car | undefined;

    constructor() {
        this.view = this.createView();
        this.updateView();
    }

    static async setWinner(car: Car) {
        this.currentWinner = car;
        const winnerInTable = await this.checkWinner(car.Id);
        if (winnerInTable) {
            await WinnerLoader.updateWinner(car.Id, {
                wins: car.winsNumbers,
                time: car.raceTime,
            });
        } else {
            await WinnerLoader.createWinner({
                id: car.Id,
                wins: car.winsNumbers,
                time: car.raceTime,
            });
        }
    }

    static checkWinner(id: number) {
        return WinnerLoader.getWinner(id);
    }

    // eslint-disable-next-line class-methods-use-this
    async updateView() {
        this.table?.deleteChildren();
        let winners: IComponent[] = [];
        const data = await WinnerLoader.getWinners();
        console.log(data, 'WINNERS');
        winners = await Promise.all(
            data.map(async (elem) => {
                console.log(elem);
                const winner = await this.drawWinner(elem);
                return winner;
            })
        );
        this.table?.appendChildren(winners);
    }

    static timeToSeconds(milliseconds: number): number {
        const seconds: number = milliseconds / 1000;
        return Math.round(seconds * 100) / 100;
    }

    // eslint-disable-next-line class-methods-use-this
    async drawWinner(data: WinnerData) {
        const { id, wins, time } = data;
        const car = await Loader.getCar(id);
        const newCar = new Car(car);
        const tableElem = tr(
            'table-elem',
            td('table-elem__number', `${id}`),
            td('table-elem__image', '', div('', newCar.carSvgObj)),
            td('table-elem__name', `${car.name}`),
            td('table-elem__wins-count', `${wins}`),
            td('table-elem__best-time', `${Winners.timeToSeconds(time)}`)
        );
        return tableElem;
    }

    // eslint-disable-next-line class-methods-use-this
    createView() {
        this.table = tbody();

        const content = div(
            'winners-container',
            h1('winners-title', 'Winners'),
            // this.table,
            table(
                'table table-warning table-striped winners-table',
                thead(
                    tr(
                        '',
                        th('table-title', '№', ''),
                        th('table-title', 'Image', ''),
                        th('table-title', 'Name', ''),
                        th('table-title', 'Wins', ''),
                        th('table-title', 'Time, sec', '')
                    )
                ),
                this.table
            )
        );

        return {
            element: content,
            map: content.getAllChildrenMap(),
        };
    }
}

export default Winners;
