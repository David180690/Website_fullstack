<script>
    import { onMount } from "svelte";

    let beers = [];
    let filteredBeers = [];
    let countries = [];
    let searchText = "";
    let searchOrigin = "";

    let newBeer = {
        name: "",
        type: "",
        alcoholContent: "",
        origin: "",
        comment: "",
        image: "",
    };

    let formErrors = {
        name: "",
        type: "",
        alcoholContent: "",
        origin: "",
        comment: "",
        image: "",
    };

    let showAddBeerForm = false;

    const token = localStorage.getItem("authToken") || "";

    const isValidToken = () => {
        return token && token.length > 0;
    };
    const fetchBeers = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/beers", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const result = await response.json();
                beers = result;
                filteredBeers = beers;
                countries = [...new Set(beers.map((beer) => beer.origin))];
            } else {
                const result = await response.json();
                console.error("Error fetching beers:", result);
                alert(
                    `Failed to fetch beers. Error: ${result.message || "Unknown error"}`,
                );
            }
        } catch (error) {
            console.error("Error fetching beers:", error);
            alert(
                "Error fetching beers. Please check the console for details.",
            );
        }
    };

    const filterBeers = () => {
        filteredBeers = beers.filter(
            (beer) =>
                beer.name.toLowerCase().includes(searchText.toLowerCase()) &&
                (!searchOrigin || beer.origin === searchOrigin),
        );
    };

    const listAllBeers = () => {
        searchText = "";
        searchOrigin = "";
        filteredBeers = beers;
    };

    const validateForm = () => {
        let isValid = true;
        for (let key in newBeer) {
            if (!newBeer[key]) {
                formErrors[key] =
                    `The ${key} field cannot be empty. Your beer glass should be full!`;
                isValid = false;
            } else {
                formErrors[key] = "";
            }
        }
        return isValid;
    };

    const addBeer = async () => {
        if (!isValidToken()) {
            alert("You must be logged in to add a beer.");
            return;
        }

        if (!validateForm()) {
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/beers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newBeer),
            });

            if (response.ok) {
                const beer = await response.json();
                alert("Beer added successfully!");
                newBeer = {
                    name: "",
                    type: "",
                    alcoholContent: "",
                    origin: "",
                    comment: "",
                    image: "",
                };
                fetchBeers();
                showAddBeerForm = false;
            } else {
                const result = await response.json();
                alert(
                    `Failed to add beer. Error: ${result.message || "Unknown error"}`,
                );
            }
        } catch (error) {
            console.error("Error adding beer:", error);
            alert("Error adding beer. Please check the console for details.");
        }
    };

    const deleteBeer = async (id) => {
        if (!isValidToken()) {
            alert("You must be logged in to delete a beer.");
            return;
        }

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this beer?",
        );
        if (!confirmDelete) {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:5000/api/beers/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            if (response.ok) {
                alert("Beer deleted successfully!");
                fetchBeers();
            } else {
                const result = await response.json();
                alert(
                    `Failed to delete beer. Error: ${result.message || "Unknown error"}`,
                );
            }
        } catch (error) {
            console.error("Error deleting beer:", error);
            alert("Error deleting beer. Please check the console for details.");
        }
    };

    onMount(() => {
        if (isValidToken()) {
            fetchBeers();
        }
    });
</script>

<!-- Your Svelte HTML -->
<!-- Your existing HTML template -->

<!-- Add Beer Button -->
<div class="add-beer-section">
    <button on:click={() => (showAddBeerForm = !showAddBeerForm)}>
        {showAddBeerForm ? "Cancel" : "Add New Beer"}
    </button>
</div>

<!-- Add New Beer Form (Only visible if showAddBeerForm is true) -->
{#if showAddBeerForm}
    <div class="add-beer-form">
        <h2>Add New Beer</h2>
        <input type="text" placeholder="Beer Name" bind:value={newBeer.name} />
        {#if formErrors.name}<p class="error">{formErrors.name}</p>{/if}

        <input type="text" placeholder="Type" bind:value={newBeer.type} />
        {#if formErrors.type}<p class="error">{formErrors.type}</p>{/if}

        <input
            type="number"
            placeholder="Alcohol Content (%)"
            bind:value={newBeer.alcoholContent}
        />
        {#if formErrors.alcoholContent}<p class="error">
                {formErrors.alcoholContent}
            </p>{/if}

        <input type="text" placeholder="Origin" bind:value={newBeer.origin} />
        {#if formErrors.origin}<p class="error">{formErrors.origin}</p>{/if}

        <textarea placeholder="Comment" bind:value={newBeer.comment}></textarea>
        {#if formErrors.comment}<p class="error">{formErrors.comment}</p>{/if}

        <input type="text" placeholder="Image URL" bind:value={newBeer.image} />
        {#if formErrors.image}<p class="error">{formErrors.image}</p>{/if}

        <button on:click={addBeer}>Submit</button>
    </div>
{/if}

<!-- Filters Section -->
<div class="filters">
    <input
        type="text"
        placeholder="Search by beer name"
        bind:value={searchText}
        on:input={filterBeers}
    />
    <select bind:value={searchOrigin} on:change={filterBeers}>
        <option value="">All Countries</option>
        {#each countries as country}
            <option value={country}>{country}</option>
        {/each}
    </select>
    <button on:click={listAllBeers}>List All Beers</button>
</div>

<!-- Beer List Section -->
<div class="beer-list">
    <h2>Beer List</h2>
    {#if filteredBeers.length > 0}
        <div class="beer-grid">
            {#each filteredBeers as beer}
                <div class="beer-card">
                    {#if beer.image}
                        <img
                            src={beer.image}
                            alt={beer.name}
                            class="beer-image"
                        />
                    {:else}
                        <div class="beer-placeholder">No image</div>
                    {/if}
                    <div class="beer-info">
                        <h3>{beer.name} ({beer.type})</h3>
                        <p>
                            <strong>Alcohol Content:</strong>
                            {beer.alcoholContent}%
                        </p>
                        <p><strong>Origin:</strong> {beer.origin}</p>
                        <p><strong>Comment:</strong> {beer.comment}</p>
                    </div>
                    <button on:click={() => deleteBeer(beer._id)}>Delete</button
                    >
                    <!-- Delete button for each beer -->
                </div>
            {/each}
        </div>
    {:else}
        <p>No beers match your criteria.</p>
    {/if}
</div>

<style>
    .filters,
    .add-beer-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        margin-bottom: 20px;
    }

    .add-beer-form {
        display: flex;
        flex-direction: column;
        gap: 15px;
        padding: 20px;
        max-width: 400px;
        background-color: #fff;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        margin-top: 20px;
    }

    .add-beer-form input,
    .add-beer-form textarea,
    .add-beer-form button {
        width: 100%;
        padding: 10px;
        font-size: 1em;
        border: 1px solid #ccc;
        border-radius: 5px;
        box-sizing: border-box;
    }

    .add-beer-form input[type="number"],
    .add-beer-form input[type="text"],
    .add-beer-form textarea {
        font-family: Arial, sans-serif;
    }

    .add-beer-form button {
        background-color: #4caf50;
        color: white;
        border: none;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .add-beer-form button:hover {
        background-color: #45a049;
    }

    .beer-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        justify-content: center;
        margin-top: 20px;
    }

    .beer-card {
        width: 250px;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
        text-align: center;
        background-color: #f9f9f9;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .beer-image {
        width: 200px;
        height: 200px;
        object-fit: cover;
        margin-bottom: 10px;
    }

    .beer-placeholder {
        width: 200px;
        height: 200px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #ddd;
        font-size: 14px;
        color: #555;
        text-align: center;
        margin-bottom: 10px;
    }

    button {
        background-color: #ff4747;
        color: white;
        padding: 5px 10px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        margin-top: 10px;
    }

    button:hover {
        background-color: #d73737;
    }

    .error {
        color: red;
        font-size: 0.9em;
        margin-top: 5px;
    }
</style>
