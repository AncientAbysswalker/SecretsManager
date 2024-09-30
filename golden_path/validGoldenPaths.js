const { UP, DOWN, LEFT, RIGHT, UP_LEFT, UP_RIGHT, DOWN_LEFT, DOWN_RIGHT } = require('./arrowKeys');
const { puzzleEnum } = require('../simple_puzzles/puzzleEnum');

module.exports = [
    {
        // Starts: Loading Bar and then The Witness
        // From: Page of Cat Sleeping at Computer
        id: '3adb72f3dda22a186d72700e190b228e1880a606',
        path: [UP, UP, UP, DOWN],
        action: (gpm) => {
            gpm.witnessManager.initiateLoadingBar(gpm.simplePuzzleManager);
        },
    },
    {
        // Starts: Loading Bar and then The Witness
        // From: Page of Cat Sleeping at Computer
        id: '096f2da0ac6ecb18e501656de9e9a7cfa816b192',
        path: [DOWN, RIGHT, UP, LEFT, UP, RIGHT],
        action: (gpm) => {
            gpm.witnessManager.initiateLoadingBar(gpm.simplePuzzleManager);
        },
    },
    {
        // Starts: Loading Bar and then The Witness
        // From: Page of Cat Sleeping at Computer
        id: '096f2da0ac6ecb18e501656de9e9a7cfa816b192',
        path: [DOWN, LEFT, UP, RIGHT, UP, LEFT],
        action: (gpm) => {
            gpm.witnessManager.initiateLoadingBar(gpm.simplePuzzleManager);
        },
    },
    {
        // Starts: Combo Lock
        // From: Rear of Scrabble
        id: '????',
        path: [DOWN, DOWN],
        action: (gpm) => {
            gpm.simplePuzzleManager.initiatePuzzle(puzzleEnum.COMBO_LOCK);
        },
    },
    {
        // Starts: Catstermind
        // From: Base64 Encoded Image
        id: '????',
        path: [UP, RIGHT, DOWN, DOWN, DOWN],
        action: (gpm) => {
            gpm.simplePuzzleManager.initiatePuzzle(puzzleEnum.CATSTERMIND);
        },
    },
    {
        // Starts: Hanoi
        // From: Super Simple Face Path
        id: '????',
        path: [
            UP, UP, DOWN, LEFT, DOWN, 
            RIGHT, LEFT, RIGHT, RIGHT, UP,
            DOWN, UP, DOWN, UP, DOWN, 
            RIGHT, LEFT, RIGHT, RIGHT, LEFT,
            UP, LEFT, DOWN, LEFT, RIGHT
        ],
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
        // Starts: ??
        // From: Fox Maze Chest Arrows Puzzle
        id: '????',
        path: [DOWN, RIGHT, DOWN, RIGHT, RIGHT, LEFT, LEFT, RIGHT, LEFT, UP, RIGHT, DOWN],
        action: (gpm) => {
            gpm.simplePuzzleManager.initiatePuzzle(puzzleEnum.FOX_MAZE);
        },
    },
    {
        // Starts: Simple Face Mural
        // From: ???
        id: '????',
        path: [RIGHT, LEFT],
        action: (gpm) => {
            gpm.simplePuzzleManager.initiatePuzzle(puzzleEnum.SIMPLE_FACES);
        },
    },
    {
        // Starts: ???
        // From: Assembling all cipher page borders
        id: '????',
        path: [
            RIGHT, RIGHT, RIGHT,
            UP, UP, RIGHT,
            DOWN, LEFT, LEFT,
            DOWN, LEFT, RIGHT,
            DOWN, DOWN, DOWN
        ],
        action: (gpm) => {
            gpm.simplePuzzleManager.initiatePuzzle(puzzleEnum.SIMPLE_FACES);
        },
    },
    {
        // Test
        id: '????',
        path: [UP, RIGHT, LEFT],
        action: (gpm) => {
            gpm.simplePuzzleManager.initiatePuzzle(puzzleEnum.TEST);
        },
    },
    // {
    //     // Test Bar
    //     id: '????',
    //     path: [UP, LEFT, RIGHT],
    //     action: (gpm) => {
    //         gpm.simplePuzzleManager.initiatePuzzle(puzzleEnum.TEST_BAR);
    //     },
    // },
    {
        // Test Bunnies
        id: '????',
        path: [UP, UP_LEFT, LEFT],
        action: (gpm) => {
            gpm.simplePuzzleManager.initiatePuzzle(puzzleEnum.BUN_1);
        },
    },
    {
        // Starts: Debug Terminal
        // From: Ciphers Page
        id: '????',
        path: [
            DOWN, DOWN,
            UP, UP, UP, UP, UP, UP, UP, UP, UP, UP
        ],
        action: (gpm) => {
            gpm.createDebugWindow();
        },
    },

    /** 
     * All valid Bunny Paths
     * 
     * Note that Bunny #0 (Glitch Bun) is created from the loading bar of WitnessManager, not GPM
     * Note that Bunny #1 (Sleep Bun) is created from the SPM by clicking on the bunny in the fox maze
     */
    {
        // Starts: Bunny #2 - Flower Buns
        // From: Fox Maze Flower Puzzle
        id: '????',
        path: [UP, RIGHT, DOWN, LEFT, DOWN, LEFT, DOWN, RIGHT, DOWN, RIGHT, UP, RIGHT, DOWN, LEFT, DOWN, LEFT, DOWN, RIGHT],
        action: (gpm) => {
            gpm.simplePuzzleManager.initiatePuzzle(puzzleEnum.BUN_2);
        },
    },
    {
        // Starts: Bunny #3 - Stripey Heart Bun
        // From: Color Page Removal Message
        id: '????',
        path: [
            UP, LEFT, DOWN, RIGHT,
            UP, LEFT, DOWN, RIGHT,
            UP, LEFT, DOWN, RIGHT
        ],
        action: (gpm) => {
            gpm.simplePuzzleManager.initiatePuzzle(puzzleEnum.BUN_0);
        },
    },
    {
        // Starts: Bunny #4 - Standing Kawaii Bun
        // From: Hanoi Title Path
        id: '????',
        path: [RIGHT, RIGHT, RIGHT, LEFT, UP, RIGHT, DOWN, RIGHT, LEFT, UP, LEFT, UP],
        action: (gpm) => {
            gpm.simplePuzzleManager.initiatePuzzle(puzzleEnum.BUN_4);
        },
    },
    {
        // Starts: Bunny #5 - Kawaii Carrot Bun
        // From: Original Golden Path
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
            gpm.simplePuzzleManager.initiatePuzzle(puzzleEnum.BUN_0);
        },
    },
    {
        // Starts: Bunny #6 - Mandarin Bun
        // From: Color Page Border Dots
        id: '????',
        // path: [LEFT],
        path: [DOWN, LEFT, DOWN, DOWN, DOWN, LEFT, LEFT, UP, DOWN, LEFT, RIGHT, UP, UP, DOWN, UP, RIGHT, LEFT, DOWN, RIGHT, RIGHT, LEFT, DOWN, UP, DOWN, DOWN, DOWN, UP, LEFT, LEFT, RIGHT, UP, LEFT, LEFT, LEFT, LEFT, LEFT, LEFT, DOWN, DOWN, DOWN, RIGHT, LEFT, LEFT, DOWN, DOWN, RIGHT, UP],
        action: (gpm) => {
            gpm.simplePuzzleManager.initiatePuzzle(puzzleEnum.BUN_6);
        },
    },
    {
        // Starts: Bunny #7 - Standing Simple Bun
        // From: Steganography
        id: '????',
        path: [
            RIGHT, UP, RIGHT, DOWN, RIGHT, RIGHT, UP, RIGHT, UP, RIGHT, DOWN, DOWN, RIGHT, RIGHT, RIGHT, UP, RIGHT, DOWN, RIGHT, UP, RIGHT, DOWN, RIGHT, DOWN, RIGHT
        ],
        action: (gpm) => {
            gpm.simplePuzzleManager.initiatePuzzle(puzzleEnum.BUN_0);
        },
    },
    {
        // Starts: Bunny #8 - Headphones Bun
        // From: Collecting Music Note Twice
        id: '????',
        path: [
            UP, UP, DOWN, DOWN, LEFT, RIGHT, LEFT, RIGHT,
            UP, UP, UP, DOWN, DOWN, DOWN, 
            LEFT, LEFT, RIGHT, LEFT, LEFT, RIGHT, RIGHT
        ],
        action: (gpm) => {
            gpm.simplePuzzleManager.initiatePuzzle(puzzleEnum.BUN_8);
        },
    },
];
