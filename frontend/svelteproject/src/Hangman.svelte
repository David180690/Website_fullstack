<script>
    let gameId = null;
    let guessedWord = "";
    let remainingAttempts = 6;
    let status = "playing";
    let letter = "";

    async function startGame() {
        const response = await fetch("http://localhost:4000/start", {
            method: "POST",
        });
        const data = await response.json();
        gameId = data.game_id;
        guessedWord = "_".repeat(data.word_length);  // Initialize guessed word
        remainingAttempts = 6;
        status = "playing";
    }

    async function guessLetter() {
        if (!letter || letter.length !== 1) {
            alert("Enter a valid single letter!");
            return;
        }

        const response = await fetch("http://localhost:4000/guess", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ game_id: gameId, letter }),
        });
        const data = await response.json();

        if (data.error) {
            alert(data.error);
            return;
        }

        // Update guessed word with correctly guessed letters
        guessedWord = data.guessed_word;
        remainingAttempts = data.remaining_attempts;
        status = data.status;
        letter = "";
    }
</script>

<div>
    {#if !gameId}
        <button on:click={startGame}>Start Game</button>
    {:else}
        <p>Word: {guessedWord}</p>
        <p>Remaining Attempts: {remainingAttempts}</p>
        <p>Status: {status}</p>

        {#if status === "playing"}
            <input type="text" bind:value={letter} maxlength="1" />
            <button on:click={guessLetter}>Guess</button>
        {/if}

        {#if status !== "playing"}
            <button on:click={startGame}>Restart</button>
        {/if}
    {/if}
</div>

<style>
    div {
        text-align: center;
        font-family: Arial, sans-serif;
    }
    button {
        margin: 10px;
        padding: 10px;
        font-size: 16px;
    }
</style>
