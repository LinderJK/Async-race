export type HandlerFn = (evt: Event) => void;

export type CarData = {
    name: string;
    color: string;
    id: number;
};

export type CarsData = Array<CarData>;

export type CallbackFunction = (data: ResponseData) => void;

export type ResponseData = CarsData | CarData;

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
