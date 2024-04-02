import { CarData, CarsData } from '../types/data-types';

class CarsLoader {
    static async loadGarageData(): Promise<CarsData> {
        try {
            const response = await fetch('http://127.0.0.1:3000/garage');
            if (!response.ok) {
                throw new Error('Failed to fetch garage');
            }
            const data = await response.json();

            return data;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    static async addCar(name: string, color: string): Promise<CarData> {
        try {
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

            const data = await response.json();

            return data;
        } catch (error) {
            console.error('Failed to add car:', error);
            throw error;
        }
    }

    static async getCar(id: number) {
        try {
            const response = await fetch(`http://127.0.0.1:3000/garage/${id}`);

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
            const response = await fetch(`http://127.0.0.1:3000/garage/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Car not found');
            }
        } catch (error) {
            console.error('Error fetching car:', error);
            throw error;
        }
    }

    static async switchToDriveMode(id: number) {
        try {
            const response = await fetch(
                `http://127.0.0.1:3000/engine?id=${id}&status=drive`,
                {
                    method: 'PATCH',
                }
            );
            if (!response.ok) {
                const errorMessage = await response.text();
                // const responseStatus = response.status;
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
                return await Promise.reject(response.status);
            }
            return response.status;
        } catch (error) {
            console.error('Error switching engine to drive mode:', error);
            throw error;
        }
    }

    static async toggleEngine(
        id: number,
        status: 'started' | 'stopped'
    ): Promise<{ velocity: number; distance: number }> {
        try {
            const response = await fetch(
                `http://127.0.0.1:3000/engine/?id=${id}&status=${status}`,
                {
                    method: 'PATCH',
                }
            );

            if (!response.ok) {
                throw new Error('Failed to toggle engine');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error toggling engine:', error);
            throw error;
        }
    }

    static async updateCar(id: number, name: string, color: string) {
        try {
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

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error update car:', error);
            throw error;
        }
    }
}

export default CarsLoader;
