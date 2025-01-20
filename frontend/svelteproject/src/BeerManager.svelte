<script>
    import { onMount } from "svelte";

    let beers = [];
    let filteredBeers = [];
    let countries = [];
    let searchText = "";
    let searchOrigin = "";

    let newBeer = {
        name: "proba",
        type: "4",
        alcoholContent: "4",
        origin: "holland",
        comment: "comment",
        image: "data:image/jpeg;base64,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",
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
                        <p><strong>who added:</strong> {beer.username}</p>
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
