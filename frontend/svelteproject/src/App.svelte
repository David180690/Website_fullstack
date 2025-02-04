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

    const pages = {
        "WelcomePage": WelcomePage,
        "BeerManager": BeerManager,
        "JokeGenerator": JokeGenerator,
        "Football": Football,
        "BeerCupManager": BeerCupManager,
        "UploadFile": UploadFile,
        "Others": Others,
        "Hangman": Hangman
    };

    async function checkToken() {
        token = localStorage.getItem("authToken");

        if (!token) {
            tokenStatusMessage = "You are not logged in.";
            isLoggedIn = false;
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/validate-token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

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

    const logout = async () => {
        try {
            const response = await fetch("http://localhost:5000/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                localStorage.removeItem("authToken");
                token = null;
                isLoggedIn = false;
                tokenStatusMessage = "You are logged out.";
                activePage = "WelcomePage";
                navigate("/");
            } else {
                console.error("Logout failed:", await response.json());
                tokenStatusMessage = "Logout failed. Please try again.";
            }
        } catch (error) {
            console.error("Error during logout:", error);
            tokenStatusMessage = "Error during logout.";
        }
    };

    function setPage(page) {
        activePage = page;
    }

    let storageListener;
    onMount(() => {
        checkToken();

        storageListener = (event) => {
            if (event.key === "authToken") {
                token = localStorage.getItem("authToken");
            }
        };

        window.addEventListener("storage", storageListener);

        return () => {
            window.removeEventListener("storage", storageListener);
        };
    });
</script>

<NavBar {activePage} {setPage} />

<main>
    <div class="token-status">
        <p>{isLoggedIn ? "You are logged in." : "You are not logged in."}</p>
        <p>{tokenStatusMessage}</p>
    </div>

    {#if isLoggedIn}
        <button on:click={logout}>Logout</button>
    {/if}

    <div class="content-container">
        {#if pages[activePage]}
            <svelte:component this={pages[activePage]} />
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

    @media (max-width: 768px) {
        .content-container {
            width: 90%;
        }
    }
</style>
