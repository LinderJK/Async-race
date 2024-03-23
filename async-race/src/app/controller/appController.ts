import { CallbackFunction } from '../types/types';

class AppController {
    // eslint-disable-next-line class-methods-use-this
    async load(callback: CallbackFunction) {
        try {
            const response = await fetch('http://localhost:3000/garage');
            if (!response.ok) {
                throw new Error('Failed to fetch garage');
            }
            const data = await response.json();
            console.log(data);
            callback(data);
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}

export default AppController;
