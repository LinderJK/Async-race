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
import WinnerLoader from '../../services/winner-loader';
import Loader from '../../services/loader';
import Car from '../car/Car';

class Winners {
    view: PageView;

    table: IComponent | undefined = undefined;

    // currentWinner: Car | undefined;

    constructor() {
        this.view = this.createView();
        this.updateView();
    }

    // eslint-disable-next-line class-methods-use-this
    deleteWinnerHandler: EventListener = async (event: Event) => {
        const customEvent = event as CustomEvent;
        const { deletedCar } = customEvent.detail;
        console.log(deletedCar.id, 'ID TO DELEEEE');
        await WinnerLoader.deleteWinner(deletedCar.id);
    };

    endRaceHandler: EventListener = async (event: Event) => {
        const customEvent = event as CustomEvent;
        const { winnerCar } = customEvent.detail;
        await this.setWinner(winnerCar);
    };

    async setWinner(car: Car) {
        const winnerInTable = await WinnerLoader.getWinner(car.Id);
        if (winnerInTable) {
            const wins = winnerInTable.wins + car.winsNumbers;
            const bestTime =
                winnerInTable.time > this.timeToSeconds(car.raceTime)
                    ? winnerInTable.time
                    : this.timeToSeconds(car.raceTime);

            await WinnerLoader.updateWinner(car.Id, {
                wins,
                time: bestTime,
            });
        } else {
            await WinnerLoader.createWinner({
                id: car.Id,
                wins: car.winsNumbers,
                time: this.timeToSeconds(car.raceTime),
            });
        }
    }

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

    // eslint-disable-next-line class-methods-use-this
    timeToSeconds(milliseconds: number): number {
        return Number((milliseconds / 1000).toFixed(2));
    }

    // eslint-disable-next-line class-methods-use-this
    async drawWinner(data: WinnerData) {
        const { id, wins, time } = data;
        console.log(id, wins, time, 'WINNERS data');
        const emptyElem = tr('');
        if (!id) {
            return emptyElem;
        }
        const car = await Loader.getCar(id);
        const newCar = new Car(car);
        const tableElem = tr(
            'table-elem',
            td('table-elem__number', `${id}`),
            td('table-elem__image', '', div('', newCar.carSvgObj)),
            td('table-elem__name', `${car.name}`),
            td('table-elem__wins-count', `${wins}`),
            td('table-elem__best-time', `${time}`)
        );
        return tableElem;
    }

    // eslint-disable-next-line class-methods-use-this
    createView() {
        this.table = tbody();

        const content = div(
            'winners-container',
            h1('winners-title', 'Winners'),
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
