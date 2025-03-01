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

export type WinnersData = Array<WinnerData>;
export type WinnerData = {
    id: number;
    wins: number;
    time: number;
};

export type HandlerFn = (evt: Event) => void;

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
