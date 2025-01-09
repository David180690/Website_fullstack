<script>
    import { onMount } from "svelte";

    import BeerManager from "./BeerManager.svelte";
    import JokeGenerator from "./JokeGenerator.svelte";
    import Football from "./Football.svelte";
    import Others from "./Others.svelte";
    import NavBar from "./NavBar.svelte";
    import WelcomePage from "./WelcomePage.svelte"; // Assuming Welcome is the default page when the app loads

    let activePage = "WelcomePage"; // Set default active page to 'Welcome'

    function setPage(page) {
        activePage = page;
    }
</script>

<NavBar {activePage} {setPage} />

<main>
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
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    body {
        background-color: #f4f4f9;
        color: #333;
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
</style>
