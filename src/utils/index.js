export function range(start, end, step=1) {
    const array = [];
    for(let i = start; i < end; i += step) {
        array.push(i);
    }

    return array;
}

export function makeMask(values) {
    if(!Array.isArray(values)) return makeMask([values])
    else {
        let mask = 0;
        for(let value of values) {
            mask += (1 << value)
        }

        return mask;
    }
}

export function testMask(mask, value) {
    return (mask & (1 << value)) > 0;
}
