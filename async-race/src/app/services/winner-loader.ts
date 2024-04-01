import type { WinnersData } from '../types/data-types';

class LoaderWin {
    // eslint-disable-next-line class-methods-use-this
    static async loadWinnersData(): Promise<WinnersData> {
        try {
            const response = await fetch('http://localhost:3000/winners');
            if (!response.ok) {
                throw new Error('Failed to fetch winners');
            }
            const data = await response.json();
            console.log(data);
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default LoaderWin;
