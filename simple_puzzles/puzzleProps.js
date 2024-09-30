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
            w: 585,
            h: 585,
        },
    ],
    [puzzleEnum.HANOI]: [
        {
            path: 'simple_puzzles/puzzles/hanoi/puzzle/index.html',
            icon: 'puzzles/hanoi/icon.png',
            w: 600,
            h: 400,
        },
        {
            path: 'simple_puzzles/puzzles/hanoi/prize/index.html',
            icon: 'puzzles/hanoi/prize/frog.png',
            w: 272,
            h: 160,
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
            path: 'simple_puzzles/puzzles/bunnies/b1/index.html',
            icon: 'puzzles/bunnies/icon.png',
            w: 1000,
            h: 1000,
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
            path: 'simple_puzzles/puzzles/test_frog/index.html',
            icon: 'prize.png',
            w: 272,
            h: 160,
        },
    ],
    [puzzleEnum.BUN_0]: [
        {
            path: 'simple_puzzles/puzzles/bunnies/b0/index.html',
            icon: 'puzzles/bunnies/icon.png',
            w: 1000,
            h: 1000,
        },
    ],
    // puzzleEnum.BUN_1 is under FOX_MAZE
    [puzzleEnum.BUN_2]: [
        {
            path: 'simple_puzzles/puzzles/bunnies/b2/index.html',
            icon: 'puzzles/bunnies/icon.png',
            w: 1000,
            h: 1000,
        },
    ],
    [puzzleEnum.BUN_3]: [
        {
            path: 'simple_puzzles/puzzles/bunnies/b3/index.html',
            icon: 'puzzles/bunnies/icon.png',
            w: 1000,
            h: 1000,
        },
    ],
    [puzzleEnum.BUN_4]: [
        {
            path: 'simple_puzzles/puzzles/bunnies/b4/index.html',
            icon: 'puzzles/bunnies/icon.png',
            w: 1000,
            h: 1000,
        },
    ],
    [puzzleEnum.BUN_5]: [
        {
            path: 'simple_puzzles/puzzles/bunnies/b5/index.html',
            icon: 'puzzles/bunnies/icon.png',
            w: 1000,
            h: 1000,
        },
    ],
    [puzzleEnum.BUN_6]: [
        {
            path: 'simple_puzzles/puzzles/bunnies/b6/index.html',
            icon: 'puzzles/bunnies/icon.png',
            w: 1000,
            h: 1000,
        },
    ],
    [puzzleEnum.BUN_7]: [
        {
            path: 'simple_puzzles/puzzles/bunnies/b7/index.html',
            icon: 'puzzles/bunnies/icon.png',
            w: 1000,
            h: 1000,
        },
    ],
    [puzzleEnum.BUN_8]: [
        {
            path: 'simple_puzzles/puzzles/bunnies/b8/index.html',
            icon: 'puzzles/bunnies/icon.png',
            w: 1000,
            h: 1000,
        },
    ],
};

module.exports = {
    puzzleProps: puzzleProps,
};
