import { CarData, CarsData } from '../types/data-types';

class Loader {
    // eslint-disable-next-line class-methods-use-this
    static async loadGarageData(): Promise<CarsData> {
        try {
            const response = await fetch('http://localhost:3000/garage');
            if (!response.ok) {
                throw new Error('Failed to fetch garage');
            }
            const data = await response.json();
            console.log(data);
            return data;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    // eslint-disable-next-line class-methods-use-this
    // addCar() {
    //     console.log('add car');
    // }
    // eslint-disable-next-line class-methods-use-this
    static async addCar(name: string, color: string): Promise<CarData> {
        try {
            const response = await fetch('http://localhost:3000/garage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, color }),
            });

            if (!response.ok) {
                throw new Error('Failed to add car');
            }

            const data = await response.json();
            console.log(data, 'all cars');
            return data;
        } catch (error) {
            console.error('Failed to add car:', error);
            throw error;
        }
    }

    static async getCar(id: number) {
        try {
            const response = await fetch(`http://localhost:3000/garage/${id}`);

            if (!response.ok) {
                throw new Error('Car not found');
            }

            return (await response.json()) as CarData;
        } catch (error) {
            console.error('Error fetching car:', error);
            throw error;
        }
    }

    static async deleteCar(id: number): Promise<void> {
        try {
            const response = await fetch(`http://localhost:3000/garage/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                // body: JSON.stringify({ name, color }),
            });
            console.log(response, 'delete card resp');

            if (!response.ok) {
                throw new Error('Car not found');
            }
        } catch (error) {
            console.error('Error fetching car:', error);
            throw error;
        }
    }

    static async toggleEngine(
        id: number,
        status: 'started' | 'stopped'
    ): Promise<{ velocity: number; distance: number }> {
        try {
            const response = await fetch(
                `http://localhost:3000/engine/?id=${id}&status=${status}`,
                {
                    method: 'PATCH',
                }
            );

            if (!response.ok) {
                throw new Error('Failed to toggle engine');
            }

            const data = await response.json();
            console.log(data, 'CAR ENGINE', response.status);
            return data;
        } catch (error) {
            console.error('Error toggling engine:', error);
            throw error;
        }
    }
}

export default Loader;
