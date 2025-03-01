import { CarData, CarsData } from '../types/data-types';

class CarsLoader {
    static async loadGarageData(): Promise<CarsData> {
        const response = await fetch('http://127.0.0.1:3000/garage');
        if (!response.ok) {
            throw new Error('Failed to fetch garage');
        }

        return response.json();
    }

    static async addCar(name: string, color: string): Promise<CarData> {
        const response = await fetch('http://127.0.0.1:3000/garage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, color }),
        });
        if (!response.ok) {
            throw new Error('Failed to add car');
        }

        return response.json();
    }

    static async getCar(id: number) {
        const response = await fetch(`http://127.0.0.1:3000/garage/${id}`);

        if (!response.ok) {
            throw new Error('Car not found');
        }

        return (await response.json()) as CarData;
    }

    static async deleteCar(id: number): Promise<void> {
        const response = await fetch(`http://127.0.0.1:3000/garage/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Car not found');
        }
    }

    static async switchToDriveMode(id: number) {
        const response = await fetch(
            `http://127.0.0.1:3000/engine?id=${id}&status=drive`,
            {
                method: 'PATCH',
            }
        );
        if (!response.ok) {
            const errorMessage = await response.text();
            if (response.status === 404) {
                console.error(
                    `Engine parameters for car with id ${id} were not found in the garage. Have you tried to set engine status to "started" before?`
                );
            } else if (response.status === 400) {
                console.error(
                    `Wrong parameters: ${id} should be any positive number, "status" should be "started", "stopped" or "drive"`
                );
            } else if (response.status === 429) {
                console.error(
                    "Drive already in progress. You can't run drive for the same car twice while it's not stopped."
                );
            } else if (response.status === 500) {
                console.error(
                    'Car has been stopped suddenly. Its engine was broken down.'
                );
            } else {
                console.error(
                    `Failed to switch engine to drive mode: ${errorMessage}`
                );
            }
            return Promise.reject(response.status);
        }
        return response.status;
    }

    static async toggleEngine(
        id: number,
        status: 'started' | 'stopped'
    ): Promise<{ velocity: number; distance: number }> {
        const response = await fetch(
            `http://127.0.0.1:3000/engine/?id=${id}&status=${status}`,
            {
                method: 'PATCH',
            }
        );

        if (!response.ok) {
            throw new Error('Failed to toggle engine');
        }
        return response.json();
    }

    static async updateCar(id: number, name: string, color: string) {
        const response = await fetch(`http://127.0.0.1:3000/garage/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, color }),
        });

        if (!response.ok) {
            throw new Error('Failed to add car');
        }
        return response.json();
    }
}

export default CarsLoader;
