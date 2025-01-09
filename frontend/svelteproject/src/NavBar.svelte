<script>
    export let setPage;
    let activePage = 'WelcomePage'; // Track the active page

    const handlePageChange = (page) => {
        activePage = page;
        setPage(page);
    };
</script>

<nav>
    <button 
        on:click={() => handlePageChange('WelcomePage')}
        class:active={activePage === 'WelcomePage'}
    >
        WelcomePage
    </button>
    <button 
        on:click={() => handlePageChange('BeerManager')}
        class:active={activePage === 'BeerManager'}
    >
        Beer Selection
    </button>
    <button 
        on:click={() => handlePageChange('JokeGenerator')}
        class:active={activePage === 'JokeGenerator'}
    >
        Jokes
    </button>
    <button 
        on:click={() => handlePageChange('Football')}
        class:active={activePage === 'Football'}
    >
        Football
    </button>
    <button 
        on:click={() => handlePageChange('Others')}
        class:active={activePage === 'Others'}
    >
        Others
    </button>
</nav>

<style>
    nav {
        display: flex;
        justify-content: center;
        gap: 15px; /* Adds space between buttons */
        padding: 10px;
        background-color: #f8f9fa;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    button {
        padding: 12px 20px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 25px; /* Rounded buttons */
        transition: all 0.3s ease; /* Smooth hover transition */
    }

    button:hover {
        background-color: #0056b3;
        transform: translateY(-3px); /* Slight lift on hover */
        box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    }

    button:active {
        transform: translateY(0); /* Return to normal when clicked */
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    /* Highlight active button */
    button.active {
        background-color: #28a745; /* Different color for active button */
        color: white;
        transform: none; /* No lift effect for the active button */
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2); /* Slightly stronger shadow */
    }
</style>
