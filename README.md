# Hang-out

This is an API to play hangman, a popular word guessing game
There are two primary modes 
1. Single player (users can watch a game live using websocket)
2. Multiplayer - Users can join and leave rooms, where the room master can start a custom game localised to the room

## Tech Stack
The API is built using following technologies
1. Node.js
2. MongoDB (To retain game and room states)

## Setup
1. Create  `.env` file to store the environment variables. Below is a template for reference
```
JWT_SECRET=Test
DB_HOST=localhost
DB_PORT=27017
PORT=8080
```
2. `npm install` 
3. `npm start`

# Flow

There are primarily two functionalities as mentioned above, with an addition of authentication methods (for login and registration of users).

For both the functions to work, a JWT token has to be generated and provided as an Authorization Bearer Token.

### 1. Single Player Game
There are three endpoints associated with this module
1. To get all active games currently being played
2. To start a single player game associated with the player
3. To provide a guess, which in turns updates the game state

In addition a user can watch a game live by sending an event `watch:game` with `gameId` in the argument of the relevant game (accessible from the list games endpoint).

#### The JWT Token has to be added to the headers for the connection to be validated as below

`"token" : <token>`

While watching a game, the API sends following events to the client

1. `ack` Acknowledges subscribed event and returns the last updated game state
2. `game:update` Sends an updated game state
3. `game:win` Sends a final state  of the game when won
4. `game:end` Sends a final state of the game when over

### 2. Multiplayer Game
The player has to join a room to be able to play

There are three endpoints associated with this module
1. To get all the rooms
2. To create a room and optionally make it private with a password
3. To start a game in a room (Only the game master can start a game). The game can be customised with options to set guess limit, and decide if system generates the word or not.

A player can join any room using a websocket connection by sending an event `join:room` with `roomId` and `password` if needed.

#### The JWT Token has to be added to the headers for the connection to be validated as below

`"token" : <token>`

While in the room, the API sends the following events to the subscribed client

1. `ack` Acknowledges subscribed event and returns the metadata for the joined room
2. `room:starts` Notifies when a new game is started in the room
2. `room:update` Sends the latest state of the game after a guess
3. `room:win` Sends a final state  of the game when won
4. `room:end` Sends a final state of the game when over

The player can make a guess by sending an event `room:guess` with arguments `roomId` and `guess`, The results of which will be broadcasted to every player in the room.

Currently there are no player specific games (due to time restriction), but according to the design following functionalities can be added to this module

1. Each player gets a personal game for the same initial state. A leaderboard can be generated based on the points thus rewarded.
2. Rotation game master. Each player in the room gets a chance to be the master.

## Endpoints

Listed below are all the endpoints registered on the API.
A postman collection can be accessed from the file `Hangman-Test.postman_collection.json`


***

| Endpoints        | Method | Body                                               | Returns                                  | Description                                            |
|------------------|--------|----------------------------------------------------|------------------------------------------|--------------------------------------------------------|
|**Auth**
| /auth/login      | POST   | username, password                                 | token                                    | Authenticates user credentials and returns a JWT Token |
| /auth/register   | POST   | username, password                                 | Registration status (success or failure) | Registers a new user         
|**Game**                          |
| /api/game        | GET    |                                                    | A list of active games                   | List of ongoing games                                  |
| /api/game/create | POST   |                                                    | Metadata of the created game             | Creates a new game associated with the player          |
| /api/game        | POST   | id, guess                                          | Updated state of the game                | Lets the user guess a character for the selected game  |
|**Room**
| /api/room        | GET    |                                                    | A list of active rooms                   | Lets the user browse the currently active rooms        |
| /api/room/create | POST   | hasPassword, password                              | Metadata of created room                 | Creates a new room with the creator as the room master |
| /api/room/start  | POST   | roomId, systemGenerated(boolean), word, guessLimit | Metadata of the multiplayer game started | Creates a multiplayer game associated with the room    |