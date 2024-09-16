# Chess Game

## Overview
This is a multiplayer chess game developed in JavaScript using Socket.IO for real-time gameplay and `chess.js` for game logic. Players can compete against each other online, with support for real-time moves, game status updates, and game reset functionality. The game follows standard chess rules, allowing for an engaging user experience.

## Features
- **Multiplayer Functionality**: The game allows two players to play against each other in real-time.
- **Real-time Move Updates**: Each player's moves are immediately reflected on both sides using Socket.IO.
- **Interactive Chessboard**: The game features an interactive chessboard where players can drag and drop pieces to make moves.
- **Valid Move Detection**: Move legality is enforced using `chess.js`, ensuring that only valid moves are executed.
- **Check, Checkmate, and Draw Detection**: The game detects check, checkmate, and draw conditions, ending the game appropriately.
- **Board Flipping for Black Player**: The chessboard is flipped for the player playing as black, offering a more intuitive experience.
- **Game Reset**: A reset button is available after the game ends, allowing players to start a new match.

## Technologies Used
- **HTML/CSS**: For the structure and styling of the chessboard and pieces.
- **JavaScript**: For game logic, move validation, and piece rendering.
- **Socket.IO**: For real-time multiplayer functionality, allowing players to compete remotely.
- **Chess.js**: For chess game rules, move validation, and game state management.
- **Tailwind CSS**: For responsive design and styling.

## How to Play
1. Open the `index.ejs` file in your browser or host the project on a server.
2. Two players can join the game, and each player will be assigned either the white or black pieces.
3. Players can drag and drop pieces on the board to make moves.
4. The game will notify players when one side is in check, checkmate, or if the game results in a draw.
5. After the game ends, players can reset the board to start a new match.

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/AD9190/Chess
   ```
2. Navigate to the project directory:
   ```bash
   cd chess-game
   ```
3. Install the required dependencies:
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   node server.js
   ```
5. Open your browser and navigate to `http://localhost:3000` to start playing.

## Future Improvements
- Add AI to allow for single-player mode.
- Implement player authentication and lobby systems.
- Add a timer for competitive matches.
- Improve game animations and visual feedback for better user experience.

