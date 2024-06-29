const { puzzleEnum } = require('./puzzleEnum');

const puzzleProps = {
    [puzzleEnum.COMBO_LOCK]: [
        {
            path: 'simple_puzzles/puzzles/combo_lock/puzzle/index.html',
            icon: 'simple_puzzles/puzzles/combo_lock/icon.png',
            w: 500,
            h: 500,
        },
        {
            path: 'simple_puzzles/puzzles/combo_lock/prize/index.html',
            icon: 'simple_puzzles/prize.png',
            w: 500,
            h: 500,
        },
    ],
    [puzzleEnum.CATSTERMIND]: [
        {
            path: 'simple_puzzles/puzzles/catstermind/puzzle/index.html',
            icon: 'simple_puzzles/puzzles/catstermind/icon.png',
            w: 800,
            h: 1200,
        },
        {
            path: 'simple_puzzles/puzzles/catstermind/petcat/index.html',
            icon: 'simple_puzzles/prize.png',
            w: 498,
            h: 498,
        },
        {
            path: 'simple_puzzles/puzzles/catstermind/prize/index.html',
            icon: 'simple_puzzles/prize.png',
            w: 500,
            h: 500,
        },
    ],
    [puzzleEnum.HANOI]: [
        {
            path: 'simple_puzzles/puzzles/hanoi/puzzle/index.html',
            icon: 'simple_puzzles/puzzles/hanoi/icon.png',
            w: 800,
            h: 1200,
        },
    ],
};

module.exports = {
    puzzleProps: puzzleProps,
};
