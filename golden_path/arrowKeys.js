const arrowKeys = Object.freeze({
    UP: 'UP ARROW',
    DOWN: 'DOWN ARROW',
    LEFT: 'LEFT ARROW',
    RIGHT: 'RIGHT ARROW',
    UP_RIGHT: 'UP AND RIGHT',
    UP_LEFT: 'UP AND LEFT',
    DOWN_RIGHT: 'DOWN AND RIGHT',
    DOWN_LEFT: 'DOWN AND LEFT',
    INVALID: 'INVALID',
});

const shiftKeys = Object.freeze({
    LSHIFT: 'LEFT SHIFT',
    RSHIFT: 'RIGHT SHIFT',
});

module.exports = {
    arrowKeys: arrowKeys,
    shiftKeys: shiftKeys,
    UP: arrowKeys.UP,
    DOWN: arrowKeys.DOWN,
    LEFT: arrowKeys.LEFT,
    RIGHT: arrowKeys.RIGHT,
    DOWN_LEFT: arrowKeys.DOWN_LEFT,
    DOWN_RIGHT: arrowKeys.DOWN_RIGHT,
    UP_LEFT: arrowKeys.UP_LEFT,
    UP_RIGHT: arrowKeys.UP_RIGHT,
    LSHIFT: shiftKeys.LSHIFT,
    RSHIFT: shiftKeys.RSHIFT,
};
