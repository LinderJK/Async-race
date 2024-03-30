export type CarData = {
    name: string;
    color: string;
    id: number;
};

export type CarsData = Array<CarData>;

export type ResponseData = CarsData | CarData | CarParams;

export type CarParams = {
    velocity: number;
    distance: number;
};

// export interface ILoader {
//     load(): Promise<CarsData>;
//
//     createCar(name: string, color: string): Promise<CarData>;
// }

export type HandlerFn = (evt: Event) => void;

// export type CallbackFunction = (data: ResponseData) => void;

export enum RequestMethod {
    GET = 0,
    POST,
    PUT,
    DELETE,
    PATCH,
    ALL,
    OPTIONS,
    HEAD,
    SEARCH,
}
