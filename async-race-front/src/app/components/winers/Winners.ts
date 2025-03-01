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
import WinnerLoader from '../../services/winners-loader';
import CarsLoader from '../../services/cars-loader';
import Car from '../car/Car';
import timeToSeconds from '../../utils/timeToSeconds';

class Winners {
    view: PageView;

    table: IComponent | undefined = undefined;

    constructor() {
        this.view = this.createView();
        this.updateView();
    }

    static deleteWinnerHandler: EventListener = async (event: Event) => {
        const customEvent = event as CustomEvent;
        const { deletedCar } = customEvent.detail;
        const winnerInTable = await WinnerLoader.getWinner(deletedCar.id);
        if (!winnerInTable) {
            return;
        }
        await WinnerLoader.deleteWinner(deletedCar.id);
    };

    static endRaceHandler: EventListener = async (event: Event) => {
        const customEvent = event as CustomEvent;
        const { winnerCar } = customEvent.detail;
        await Winners.setWinner(winnerCar);
    };

    static async setWinner(car: Car) {
        const winnerInTable = await WinnerLoader.getWinner(car.Id);
        if (winnerInTable) {
            const wins = winnerInTable.wins + car.Wins;

            const bestTime =
                winnerInTable.time > timeToSeconds(car.Time)
                    ? winnerInTable.time
                    : timeToSeconds(car.Time);

            await WinnerLoader.updateWinner(car.Id, {
                wins,
                time: bestTime,
            });
        } else {
            await WinnerLoader.createWinner({
                id: car.Id,
                wins: car.Wins,
                time: timeToSeconds(car.Time),
            });
        }
    }

    async updateView() {
        this.table?.deleteChildren();
        const data = await WinnerLoader.getWinners();
        const winners = await Promise.all(
            data.map(async (elem) => {
                return Winners.drawWinner(elem);
            })
        );
        this.table?.appendChildren(winners);
    }

    static async drawWinner(data: WinnerData) {
        const { id, wins, time } = data;
        const emptyElem = tr('');
        if (!id) {
            return emptyElem;
        }
        const car = await CarsLoader.getCar(id);
        const newCar = new Car(car);
        return tr(
            'table-elem',
            td('table-elem__number', `${id}`),
            td('table-elem__image', '', div('', newCar.carSvgObj)),
            td('table-elem__name', `${car.name}`),
            td('table-elem__wins-count', `${wins}`),
            td('table-elem__best-time', `${time}`)
        );
    }

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
