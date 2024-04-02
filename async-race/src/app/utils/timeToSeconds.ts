const timeToSeconds = (milliseconds: number): number => {
    return Number((milliseconds / 1000).toFixed(2));
};

export default timeToSeconds;
