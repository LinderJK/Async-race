import type { WinnersData } from '../types/data-types';

class WinnerLoader {
    static async getWinners(): Promise<WinnersData> {
        try {
            const response = await fetch('http://localhost:3000/winners');
            if (!response.ok) {
                throw new Error('Failed to fetch winners');
            }
            return await response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async getWinner(id: number) {
        try {
            const response = await fetch(`http://localhost:3000/winners/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch winner');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching winner:', error);
            return null;
        }
    }

    static async createWinner(data: {
        id: number;
        wins: number;
        time: number;
    }) {
        try {
            const response = await fetch('http://localhost:3000/winners', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error('failed to create winner');
            }
            return await response.json();
        } catch (error) {
            console.error('error create winner:', error);
            return null;
        }
    }

    static async deleteWinner(id: number) {
        try {
            const response = await fetch(
                `http://localhost:3000/winners/${id}`,
                {
                    method: 'DELETE',
                }
            );
            if (!response.ok) {
                throw new Error('failed to delete winner');
            }
            return true;
        } catch (error) {
            console.error('error delete winner:', error);
            return false;
        }
    }

    static async updateWinner(
        id: number,
        data: { wins: number; time: number }
    ) {
        try {
            const response = await fetch(
                `http://localhost:3000/winners/${id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                }
            );
            if (!response.ok) {
                throw new Error('failed to update winner');
            }
            return await response.json();
        } catch (error) {
            console.error('error update winner:', error);
            return null;
        }
    }
}

export default WinnerLoader;
