
![SecretsManager Logo](https://raw.githubusercontent.com/AncientAbysswalker/SecretsManager/refs/heads/main/SecretsManager.svg)

# SecretsManager - Christmas 2024 Scavenger Hunt Puzzle System

This Electron application was developed as part of a Christmas 2024 scavenger hunt to allow for opening and running puzzles on a computer using a series of inputs trigger them. The system provides a framework for managing different types of interactive puzzles with special window behaviors and checkpointing capabilities.

## Overview

The application is designed to remain hidden from the taskbar until a puzzle is opened, providing a seamless experience for puzzle solvers. It supports multiple input methods and includes checkpointing functionality so users can resume puzzles if they accidentally close a window partway through.

## Key Features

-   **Checkpointing**: Automatic progress saving for complex multi-stage puzzles
-   **Window Management**: Smart positioning, sizing, and always-on-top behavior
-   **Hidden Taskbar**: Application remains hidden until puzzles are actively running
-   **Special Effects**: Custom window behaviors like title manipulation and incremental resizing
-   **Global Hotkeys**: System-wide arrow key detection for golden path inputs
-   **Flexible Architecture**: Easy to add new puzzle types and behaviors

## Core Architecture

### WitnessManager

The first component developed, `WitnessManager` handles running Witness-style line-tracing puzzles locally. It manages:

-   **Puzzle Loading**: Loads puzzles from serialized data and creates appropriately sized windows
-   **Window Management**: Creates puzzle windows with random positioning and proper sizing based on grid dimensions
-   **Progress Tracking**: Maintains lists of solved and unsolved puzzles, progressing through them sequentially
-   **Loading Bar**: Shows a loading animation before starting puzzles
-   **Completion Detection**: Listens for `solved_event::{puzzle_name}` IPC messages from puzzle JavaScript
-   **Ending Sequence**: Displays a final prize window when all puzzles are completed

The Witness puzzles communicate completion by calling:

```javascript
ipcRenderer.send(`solved_event::${document.title}`);
```

### GoldenPathManager

Added to manage "golden paths" - valid arrow key input sequences based on the game Tunic. Features:

-   **Global Key Listening**: Uses `node-global-key-listener` to capture arrow keys system-wide
-   **Path Validation**: Compares input sequences against predefined valid golden paths
-   **Buffering System**: Supports shift+arrow combinations for diagonal inputs (UP_LEFT, UP_RIGHT, etc.)
-   **Timeout Management**: Resets path tracking after 5 seconds of inactivity
-   **Debug Window**: Optional visual feedback showing captured inputs and buffer state
-   **Action Triggering**: Executes associated actions when valid paths are completed

This manager serves as the entry point for all other puzzles and will trigger the puzzles associated with a given path.

### SimplePuzzleManager

A general abstraction developed later that works better than the Witness manager for most puzzle types. It provides:

-   **State Management**: Tracks puzzle state including current index, checkpoint index, and active windows
-   **Checkpointing**: Saves progress at specific points so users can resume if windows are closed
-   **Sequential Progression**: Manages multi-stage puzzles with prize windows at the end
-   **IPC Integration**: Injects `emitPuzzleSolvedEvent()` function into puzzle windows for completion signaling
-   **Flexible Configuration**: Uses `puzzleProps` for defining puzzle sequences with custom window sizes and paths

Puzzles signal completion by calling the injected function:

```javascript
emitPuzzleSolvedEvent();
```

### WindowHandlers

Special behavior handlers for Electron windows:

#### TitlePuzzleHandler

-   **Hidden Messages**: Displays secret messages by temporarily replacing random characters in window titles
-   **Timing Control**: Configurable display duration and intervals between character reveals
-   **Automatic Cycling**: Repeats the message sequence after a set number of intervals

#### IncrementalWindowResizeHandler

-   **Gradual Resizing**: Smoothly increases window size in increments
-   **Animation**: Uses 10ms intervals for smooth resize animation
-   **Bounds Checking**: Prevents resizing beyond target dimensions

## Puzzle Communication System

The system uses Electron's IPC (Inter-Process Communication) for puzzle completion:

1. **Simple Puzzles**: The `SimplePuzzleManager` injects a global `emitPuzzleSolvedEvent()` function into each puzzle window
2. **Witness Puzzles**: Use the witness engine's built-in IPC sending with puzzle-specific event names
3. **Event Listeners**: Each manager sets up listeners for their specific puzzle completion events
4. **Cleanup**: Listeners are properly removed when windows close to prevent memory leaks

## Example Puzzle Implementation

Here's how a simple puzzle signals completion:

```javascript
// In puzzle JavaScript (e.g., combo_lock/puzzle/script.js)
function checkLock() {
    combinationLock.check();
    if (combinationLock.locked === false) {
        document.querySelector('#indicator').classList.add('unlocked');
        setTimeout(() => {
            emitPuzzleSolvedEvent(); // Calls the injected function
        }, 500);
    }
}
```

## Adding a New Simple Puzzle

To add a new puzzle using the `SimplePuzzleManager` system, follow these steps:

1.  **Add to Puzzle Enum**  
    Locate the puzzle enum `simple_puzzles/puzzleEnum.js` and add a new entry for your puzzle.

    ```javascript
    // ...existing code...
    export const PuzzleEnum = {
        // ...existing puzzles...
        MY_NEW_PUZZLE: 'my_new_puzzle',
    };
    // ...existing code...
    ```

2.  **Create Puzzle Folder**  
    Inside the `simple_puzzles/` directory, create a new folder named after your puzzle (e.g., `my_new_puzzle/`).

    -   Add an `index.html` file as the landing point for the puzzle window.
    -   Add any supporting files (JavaScript, CSS, images).
    -   Place an icon file (e.g., `icon.png`) for use in the window or UI.

3.  **Configure Puzzle Props**  
    In the file where `puzzleProps` are defined (often `simple_puzzles/puzzleProps.js`), add a new entry for your puzzle. Specify the HTML path, window size, and any other required properties.

    ```javascript
    // ...existing code...
    export const puzzleProps = {
        // ...existing puzzles...
        [puzzleEnum.MY_NEW_PUZZLE]: [
            {
                path: 'simple_puzzles/my_new_puzzle/index.html',
                width: 500,
                height: 400,
                icon: 'simple_puzzles/my_new_puzzle/icon.png',
                // Set ignoreCheckpoint: true if you do NOT want checkpointing (if you close the window you will resume from this puzzle) for this puzzle
                ignoreCheckpoint: false,
                // ...other options...
            },
            // ...more puzzles in the sequence
        ],
    };
    // ...existing code...
    ```

    > **Note:**
    >
    > -   Use the `ignoreCheckpoint: true` option if you want to disable checkpointing for this puzzle (e.g., for single-stage or stateless puzzles).

4.  **(Optional) Add to Puzzle Sequence**  
    If your puzzle should be part of a sequence, ensure that you add multiple puzzles to the list. In your puzzle's JavaScript, call the injected `emitPuzzleSolvedEvent()` function when the puzzle is solved:

    ```javascript
    // ...existing code...
    emitPuzzleSolvedEvent();
    // ...existing code...
    ```

5.  **Add to Valid Golden Paths**  
     To have your puzzle triggered by a golden path input, add its enum key to the `module.exports` mapping in `golden_path/validGoldenPaths.js`:

        ```javascript
        // ...existing code...
        module.exports = [
            // ...existing paths...
            {
                path: [DOWN, LEFT, UP, RIGHT, UP, LEFT],
                action: (gpm) => {
                    gpm.simplePuzzleManager.initiatePuzzle(puzzleEnum.MY_NEW_PUZZLE);
                },
            }
            // ...existing paths...
        ];
        // ...existing code...
        ```

## Project Structure

-   `witness/` - Witness puzzle engine and puzzle files
-   `golden_path/` - Golden path management and validation
-   `simple_puzzles/` - General puzzle framework and individual puzzles
-   `index.js` - Main application entry point that initializes all managers

## Run Locally

```bash
npm start
```

## Building Standalone Runtime

To create a standalone executable:

```bash
electron-packager . --overwrite --icon "SecretsManager.ico"
```
