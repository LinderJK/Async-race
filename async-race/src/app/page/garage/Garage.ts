import { CarData } from '../../types/types';

class Garage {
    draw(data: CarData, container: HTMLElement) {
        console.log(data);
        data.forEach((carData) => {
            const carElement = this.createCar(carData);
            container.append(carElement);
        });
    }

    // eslint-disable-next-line class-methods-use-this
    createCar(carData: CarData[number]) {
        const { name, id, color } = carData;
        const div = document.createElement('div');
        div.textContent = `${name}, ${id}, ${color}`;
        return div;
    }
}

export default Garage;
