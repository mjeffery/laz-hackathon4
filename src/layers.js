import { makeMask } from './utils'

export const TERRAIN = 1;
export const LAVA = 2;
export const COLLECTIBLE = 3;
export const EXIT = 4;
export const OBJECTS = 5;
export const ALL = [TERRAIN, LAVA, COLLECTIBLE, EXIT, OBJECTS]

export const DEFAULT_MASK = makeMask([TERRAIN])
export const ALL_MASK = makeMask(ALL)

export const getCollisionMask = Symbol('getCollisionMask')

export function getMask(sprite) {
    let mask = DEFAULT_MASK;
    
    const getter = sprite[getCollisionMask];
    if(getter && (typeof getter === 'function')) {
        mask = getter.call(sprite);
    }

    return mask;
}
