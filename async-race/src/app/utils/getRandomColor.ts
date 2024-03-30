const getRandomColor = (): string => {
    const red = Math.floor(Math.random() * 256)
        .toString(16)
        .padStart(2, '0');
    const green = Math.floor(Math.random() * 256)
        .toString(16)
        .padStart(2, '0');
    const blue = Math.floor(Math.random() * 256)
        .toString(16)
        .padStart(2, '0');
    return `#${red}${green}${blue}`;
};

export default getRandomColor;
