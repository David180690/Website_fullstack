<script>
    import { onMount } from "svelte";
    import BeerManager from "./BeerManager.svelte";
    import JokeGenerator from "./JokeGenerator.svelte";
    import Football from "./Football.svelte";
    import Others from "./Others.svelte";
    import NavBar from "./NavBar.svelte";
    import WelcomePage from "./WelcomePage.svelte";
    import { navigate } from "svelte-routing"; // Or use your preferred routing method
    import UploadFile from "./UploadFile.svelte";

    let activePage = "WelcomePage"; // Default active page
    let token = null; // Store the token
    let isLoggedIn = false; // Track login status
    let tokenStatusMessage = ""; // Message to show token status
    let message = "";

    // Check if the token is valid
    async function checkToken() {
        const token = localStorage.getItem("authToken");
        if (!token) {
            message = "No token found";
            tokenStatusMessage = "You are not logged in.";
            isLoggedIn = false;
            return;
        }

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

        if (!response.ok) {
            console.error(`Error validating token: ${response.statusText}`);
            message = "Token validation failed";
            tokenStatusMessage = "Token validation failed.";
            isLoggedIn = false;
            return;
        }

        const text = await response.text();
        console.log("Response text:", text);

        if (text) {
            try {
                const data = JSON.parse(text);
                console.log("Token is valid:", data);
                message = "Token is valid";
                tokenStatusMessage = `Logged in as ${data.user.username}`;
                isLoggedIn = true; // Set the login status to true
            } catch (err) {
                console.error("Error parsing response as JSON:", err);
            }
        } else {
            console.error("Empty response body");
        }
    }

    // Logout function
    const logout = () => {
        // Remove token from localStorage
        localStorage.removeItem("authToken");

        // Update UI state
        isLoggedIn = false;
        tokenStatusMessage = "You are logged out.";
        message = "You have been logged out.";

        // Navigate to the homepage (root of the app)
        navigate("/"); // This will navigate to http://localhost:5555
        window.location.reload();
    };

    onMount(() => {
        checkToken();
    });

    // Function to set the active page
    function setPage(page) {
        activePage = page;
    }
</script>

<NavBar {activePage} {setPage} />

<main>
    <!-- Display token status -->
    <div class="token-status">
        <p>{isLoggedIn ? "You are logged in." : "You are not logged in."}</p>
        <p>{tokenStatusMessage}</p>
    </div>

    <!-- Logout button (only shows when logged in) -->
    {#if isLoggedIn}
        <button on:click={logout}>Logout</button>
    {/if}

    <!-- Main content section -->
    <div class="content-container">
        {#if activePage === "WelcomePage"}
            <WelcomePage />
        {:else if activePage === "BeerManager"}
            <BeerManager />
        {:else if activePage === "JokeGenerator"}
            <JokeGenerator />
        {:else if activePage === "Football"}
            <Football />
        {:else if activePage === "UploadFile"}
            <UploadFile />
        {:else if activePage === "Others"}
            <Others />
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
