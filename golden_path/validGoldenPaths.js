const { UP, DOWN, LEFT, RIGHT } = require('./arrowKeys');
const { puzzleEnum } = require('../simple_puzzles/puzzleEnum');

module.exports = [
    {
        // The Witness
        id: '3adb72f3dda22a186d72700e190b228e1880a606',
        path: [UP, UP, UP, DOWN],
        action: (gpm) => {
            gpm.witnessManager.initiatePuzzles();
        },
    },
    {
        // Combo Lock
        id: '????',
        path: [DOWN, DOWN],
        action: (gpm) => {
            gpm.simplePuzzleManager.initiatePuzzle(puzzleEnum.COMBO_LOCK);
        },
    },
    {
        // Catstermind
        id: '????',
        path: [LEFT, LEFT],
        action: (gpm) => {
            gpm.simplePuzzleManager.initiatePuzzle(puzzleEnum.CATSTERMIND);
        },
    },
    {
        // Hanoi
        id: '????',
        path: [RIGHT, RIGHT],
        action: (gpm) => {
            gpm.simplePuzzleManager.initiatePuzzle(puzzleEnum.HANOI);
        },
    },
    {
        // Starts: Start Fox Maze
        // From: ???
        id: '????',
        path: [LEFT, RIGHT],
        action: (gpm) => {
            gpm.simplePuzzleManager.initiatePuzzle(puzzleEnum.FOX_MAZE);
        },
    },
    {
        // Starts: Bunny #X
        // From: Fox Maze Flower Puzzle
        id: '????',
        path: [UP, RIGHT, DOWN, LEFT, DOWN, LEFT, DOWN, RIGHT, DOWN, RIGHT, UP, RIGHT, DOWN, LEFT, DOWN, LEFT, DOWN, RIGHT],
        action: (gpm) => {
            gpm.simplePuzzleManager.initiatePuzzle(puzzleEnum.FOX_MAZE);
        },
    },
    {
        // Starts: ??
        // From: Fox Maze Chest Arrows Puzzle
        id: '????',
        path: [DOWN, RIGHT, DOWN, RIGHT, RIGHT, LEFT, LEFT, RIGHT, LEFT, UP, RIGHT, DOWN],
        action: (gpm) => {
            gpm.simplePuzzleManager.initiatePuzzle(puzzleEnum.FOX_MAZE);
        },
    },
    {
        // Test
        id: '????',
        path: [RIGHT, LEFT],
        action: (gpm) => {
            gpm.simplePuzzleManager.initiatePuzzle(puzzleEnum.TEST_BAR);
        },
    },
    {
        // True Golden Path
        id: 'ef361c8dc6409be689ea3bd26d6943152f615823',
        path: [
            UP,
            LEFT,
            DOWN,
            LEFT,
            UP,
            LEFT,
            DOWN,
            LEFT,
            UP,
            RIGHT,
            UP,
            RIGHT,
            UP,
            LEFT,
            UP,
            RIGHT,
            DOWN,
            RIGHT,
            UP,
            LEFT,
            UP,
            LEFT,
            UP,
            RIGHT,
            UP,
            LEFT,
            DOWN,
            LEFT,
            UP,
            RIGHT,
            UP,
            UP,
            LEFT,
            UP,
            RIGHT,
            DOWN,
            RIGHT,
            DOWN,
            RIGHT,
            UP,
            RIGHT,
            DOWN,
            LEFT,
            DOWN,
            RIGHT,
            UP,
            RIGHT,
            RIGHT,
            DOWN,
            RIGHT,
            UP,
            RIGHT,
            DOWN,
            RIGHT,
            UP,
            RIGHT,
            RIGHT,
            DOWN,
            LEFT,
            DOWN,
            LEFT,
            DOWN,
            RIGHT,
            DOWN,
            RIGHT,
            DOWN,
            LEFT,
            LEFT,
            DOWN,
            RIGHT,
            DOWN,
            LEFT,
            DOWN,
            RIGHT,
            UP,
            RIGHT,
            DOWN,
            RIGHT,
            UP,
            RIGHT,
            RIGHT,
            DOWN,
            DOWN,
            LEFT,
            UP,
            RIGHT,
            UP,
            LEFT,
            DOWN,
            LEFT,
            UP,
            LEFT,
            UP,
            LEFT,
            UP,
            RIGHT,
            RIGHT,
            UP,
            LEFT,
            UP,
        ],
        action: (gpm) => {
            console.log('original golden path');
        },
    },
    {
        id: '096f2da0ac6ecb18e501656de9e9a7cfa816b192',
        path: [DOWN, RIGHT, UP, LEFT, UP, RIGHT],
        action: (gpm) => {
            console.log('learning golden path');
        },
    },
    {
        id: '096f2da0ac6ecb18e501656de9e9a7cfa816b192',
        path: [DOWN, LEFT, UP, RIGHT, UP, LEFT],
        action: (gpm) => {
            console.log('learning golden path (alt)');
        },
    },
];
