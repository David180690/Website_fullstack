<script>
    import { onMount } from "svelte";
    import BeerManager from "./BeerManager.svelte";
    import JokeGenerator from "./JokeGenerator.svelte";
    import Football from "./Football.svelte";
    import Others from "./Others.svelte";
    import NavBar from "./NavBar.svelte";
    import WelcomePage from "./WelcomePage.svelte";
    import { navigate } from "svelte-routing";
    import UploadFile from "./UploadFile.svelte";
    import BeerCupManager from "./BeerCupManager.svelte";
    import Hangman from "./Hangman.svelte";

    let activePage = "WelcomePage"; // Default active page
    let token = localStorage.getItem("authToken");
    let isLoggedIn = false;
    let tokenStatusMessage = "";
    let message = "";

    // Reactive token status
    $: checkToken();

    async function checkToken() {
        if (!token) {
            tokenStatusMessage = "You are not logged in.";
            isLoggedIn = false;
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:5000/api/validate-token",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            if (response.ok) {
                const data = await response.json();
                tokenStatusMessage = `Logged in as ${data.user.username}`;
                isLoggedIn = true;
            } else {
                tokenStatusMessage = "Token validation failed.";
                isLoggedIn = false;
            }
        } catch (error) {
            console.error("Error validating token:", error);
            tokenStatusMessage = "Error validating token.";
            isLoggedIn = false;
        }
    }

    const logout = () => {
        localStorage.removeItem("authToken");
        token = null; // Reassign token
        isLoggedIn = false;
        tokenStatusMessage = "You are logged out.";
        navigate("/"); // Redirect to home
        activePage = "WelcomePage"; // Reset to welcome page
    };

    function setPage(page) {
        activePage = page; // Update active page
    }

    onMount(() => {
        // Initial token check
        checkToken();

        // Listen for storage changes
        window.addEventListener("storage", (event) => {
            if (event.key === "authToken") {
                token = localStorage.getItem("authToken");
            }
        });

        return () => {
            window.removeEventListener("storage", () => {});
        };
    });
</script>

<!-- Navigation bar -->
<NavBar {activePage} {setPage} />

<main>
    <!-- Token status -->
    <div class="token-status">
        <p>{isLoggedIn ? "You are logged in." : "You are not logged in."}</p>
        <p>{tokenStatusMessage}</p>
    </div>

    <!-- Logout button -->
    {#if isLoggedIn}
        <button on:click={logout}>Logout</button>
    {/if}

    <!-- Render active page -->
    <div class="content-container">
        {#if activePage === "WelcomePage"}
            <WelcomePage />
        {:else if activePage === "BeerManager"}
            <BeerManager />
        {:else if activePage === "JokeGenerator"}
            <JokeGenerator />
        {:else if activePage === "Football"}
            <Football />
        {:else if activePage === "BeerCupManager"}
            <BeerCupManager />
        {:else if activePage === "UploadFile"}
            <UploadFile />
        {:else if activePage === "Others"}
            <Others />
        {:else if activePage === "Hangman"}
            <Hangman />
        {/if}
    </div>
</main>

<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    }

    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px;
        min-height: 100vh;
    }

    .content-container {
        background: white;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        padding: 30px;
        width: 100%;
        max-width: 900px;
        margin-top: 20px;
        transition: all 0.3s ease;
    }

    /* Style for NavBar */

    /* Add responsiveness */
    @media (max-width: 768px) {
        .content-container {
            width: 90%;
        }
    }

    button {
        margin-top: 20px;
        padding: 10px 20px;
        background-color: #ff6347;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }

    button:hover {
        background-color: #ff4500;
    }
</style>
