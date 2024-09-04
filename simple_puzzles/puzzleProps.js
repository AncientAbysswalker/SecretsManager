const { puzzleEnum } = require('./puzzleEnum');

const puzzleProps = {
    [puzzleEnum.COMBO_LOCK]: [
        {
            path: 'simple_puzzles/puzzles/combo_lock/puzzle/index.html',
            icon: 'puzzles/combo_lock/icon.png',
            w: 500,
            h: 500,
        },
        {
            path: 'simple_puzzles/puzzles/combo_lock/prize/index.html',
            icon: 'prize.png',
            w: 500,
            h: 500,
        },
    ],
    [puzzleEnum.CATSTERMIND]: [
        {
            path: 'simple_puzzles/puzzles/catstermind/puzzle/index.html',
            icon: 'puzzles/catstermind/icon.png',
            w: 800,
            h: 1200,
        },
        {
            path: 'simple_puzzles/puzzles/catstermind/petcat/index.html',
            icon: 'prize.png',
            w: 498,
            h: 498,
            ignoreCheckpoint: true,
        },
        {
            path: 'simple_puzzles/puzzles/catstermind/prize/index.html',
            icon: 'prize.png',
            w: 500,
            h: 500,
        },
    ],
    [puzzleEnum.HANOI]: [
        {
            path: 'simple_puzzles/puzzles/hanoi/puzzle/index.html',
            icon: 'puzzles/hanoi/icon.png',
            w: 600,
            h: 400,
        },
    ],
    [puzzleEnum.FOX_MAZE]: [
        {
            path: 'simple_puzzles/puzzles/fox_maze/puzzle/index.html',
            icon: 'puzzles/fox_maze/icon.png',
            w: 1600,
            h: 160,
        },
        {
            path: 'simple_puzzles/puzzles/fox_maze/prize/index.html',
            icon: 'prize.png',
            w: 500,
            h: 500,
            ignoreCheckpoint: true,
        },
    ],
    [puzzleEnum.SIMPLE_FACES]: [
        {
            path: 'simple_puzzles/puzzles/simple_faces/index.html',
            icon: 'puzzles/simple_faces/icon.png',
            w: 432,
            h: 432,
        },
    ],
    [puzzleEnum.TEST_BAR]: [
        {
            path: 'simple_puzzles/puzzles/test_bar/index.html',
            icon: 'prize.png',
            w: 432,
            h: 432,
        },
    ],
    [puzzleEnum.TEST]: [
        {
            path: 'simple_puzzles/puzzles/test/index.html',
            icon: 'prize.png',
            w: 432,
            h: 432,
        },
    ],
    [puzzleEnum.BUN_0]: [
        {
            path: 'simple_puzzles/puzzles/bunnies/b0/index.html',
            icon: 'puzzles/bunnies/icon.png',
            w: 600,
            h: 432,
        },
    ],
};

module.exports = {
    puzzleProps: puzzleProps,
};
