# Guess That Pokemon

A browser-based Pokemon guessing game powered by [PokeAPI](https://pokeapi.co/).

## Features

- Random Pokemon loading from the API
- Gen V black/white sprite preference with fallback behavior
- Difficulty modes:
  - Easy: 3 attempts
  - Medium: 2 attempts
  - Hard: 1 attempt
- Silhouette reveal mechanic
- Score tracking per session

## Tech Stack

- HTML
- CSS
- JavaScript (vanilla)

## Project Structure

- `Index.html` - page structure and UI elements
- `style.css` - visual styling and layout
- `app.js` - game logic, API calls, and event handlers

## Run Locally

1. Open this folder in VS Code.
2. Open `Index.html` in your browser.
3. Select a difficulty and click **Load Pokemon**.

## Gameplay

1. Choose a difficulty.
2. Load a Pokemon.
3. Enter your guess and submit.
4. If correct, your score increases.
5. If incorrect, hints and remaining attempts are shown.
6. Click **Next Round** to continue.

## API Notes

Data is fetched from:

- `https://pokeapi.co/api/v2/pokemon/{id}`

Sprites are selected in this order:

1. Gen V black/white animated sprite
2. Gen V black/white static sprite
3. Default front sprite
4. Official artwork

## License

No license specified yet.
