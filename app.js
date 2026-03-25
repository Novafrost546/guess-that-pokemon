const API_BASE = "https://pokeapi.co/api/v2/pokemon/";

// Cache DOM nodes once to avoid repeated queries during gameplay.
const scoreEl = document.getElementById("score");
const loadBtn = document.getElementById("loadBtn");
const submitBtn = document.getElementById("submitBtn");
const nextBtn = document.getElementById("nextBtn");
const guessInput = document.getElementById("guessInput");
const difficultySelect = document.getElementById("difficultySelect");
const statusEl = document.getElementById("status");
const hintEl = document.getElementById("hint");
const pokemonImg = document.getElementById("pokemonImg");

// Round state.
let currentPokemonName = "";
let currentPrimaryType = "";
let score = 0;
let attempts = 0;
let roundOver = false;

const DIFFICULTY_ATTEMPTS = {
    easy: 3,
    medium: 2,
    hard: 1
};

function getMaxAttempts() {
    const selectedDifficulty = difficultySelect.value;
    return DIFFICULTY_ATTEMPTS[selectedDifficulty];
}

function normalizeGuess(value) {
    return value.trim().toLowerCase();
}

function setStatus(message, isError) {
    statusEl.textContent = message;
    statusEl.className = isError ? "error" : "";
}

// Reveal sprite and lock guessing until next round.
function revealPokemon() {
    pokemonImg.style.filter = "none";
    roundOver = true;
    submitBtn.disabled = true;
    nextBtn.disabled = false;
}

// Hide sprite silhouette and re-enable guessing for a fresh round.
function hidePokemon() {
    pokemonImg.style.filter = "brightness(0)";
    roundOver = false;
    submitBtn.disabled = false;
    nextBtn.disabled = true;
}

//grabs the animated sprite if available, otherwise falls back to the default sprite.
function getPreferredSprite(data) {
    const gen5 = data.sprites?.versions?.["generation-v"]?.["black-white"];

    return (
        gen5?.animated?.front_default ||
        gen5?.front_default ||
        data.sprites?.front_default ||
        data.sprites?.other?.["official-artwork"]?.front_default ||
        ""
    );
}

async function loadPokemon() {
    const maxAttempts = getMaxAttempts();
    if (!maxAttempts) {
        setStatus("Select a difficulty first.", true);
        return;
    }

    // Reset UI state before requesting a new random pokemon up to gen 9.
    setStatus("Loading Pokemon...", false);
    hintEl.textContent = "";
    guessInput.value = "";
    attempts = 0;

    //update when new gen comes out, currently at gen 9.
    const randomId = Math.floor(Math.random() * 1025) + 1;

    try {
        const response = await fetch(API_BASE + randomId);
        if (!response.ok) {
            throw new Error("API returned " + response.status);
        }

        const data = await response.json();
        currentPokemonName = data.name;
        currentPrimaryType = data.types[0].type.name;
        pokemonImg.src = getPreferredSprite(data);

        hidePokemon();
        setStatus("Pokemon loaded. Make a guess.", false);
        hintEl.textContent = "Hint: Primary type is " + currentPrimaryType + ". Attempts allowed: " + maxAttempts + ".";
    } catch (error) {
        currentPokemonName = "";
        currentPrimaryType = "";
        pokemonImg.src = "";
        setStatus("Could not load Pokemon. Please try again.", true);
    }
}

function submitGuess() {
    const maxAttempts = getMaxAttempts();
    if (!maxAttempts) {
        setStatus("Select a difficulty first.", true);
        return;
    }

    if (!currentPokemonName) {
        setStatus("Load a Pokemon first.", true);
        return;
    }

    if (roundOver) {
        setStatus("Round is over. Click Next Round.", false);
        return;
    }

    const guess = normalizeGuess(guessInput.value);
    if (!guess) {
        setStatus("Type a guess before submitting.", true);
        return;
    }

    // Limit guesses based on selected difficulty.
    attempts += 1;

    if (guess === currentPokemonName) {
        score += 1;
        scoreEl.textContent = String(score);
        setStatus("Correct! It is " + currentPokemonName + ".", false);
        hintEl.textContent = "Great job. Click Next Round for another one.";
        revealPokemon();
        return;
    }

    if (attempts >= maxAttempts) {
        setStatus("Out of attempts. It was " + currentPokemonName + ".", true);
        hintEl.textContent = "Try another round.";
        revealPokemon();
    } else {
        // Give a progressively stronger hint after each incorrect attempt.
        const attemptsLeft = maxAttempts - attempts;
        const firstLetter = currentPokemonName.charAt(0).toUpperCase();
        setStatus("Not quite. Try again.", true);
        hintEl.textContent = "Hint: Name starts with " + firstLetter + ". Attempts left: " + attemptsLeft + ".";
    }
}

loadBtn.addEventListener("click", loadPokemon);
submitBtn.addEventListener("click", submitGuess);
nextBtn.addEventListener("click", loadPokemon);
difficultySelect.addEventListener("change", () => {
    attempts = 0;
    setStatus("Difficulty set to " + difficultySelect.value + ". Click Load Pokemon.", false);
    hintEl.textContent = "";
});
guessInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        submitGuess();
    }
});

loadPokemon();
