<script>
    export let name = "";
    export let file = null;
    let uploadedFiles = [];
    let loading = false; // To manage loading state
    let errorMessage = ""; // To display any error message

    const handleFileChange = (event) => {
        file = event.target.files[0];
    };
    async function fetchUploadedFiles() {
        loading = true; // Start loading
        try {
            const response = await fetch("http://localhost:5002/files");
            if (!response.ok) {
                throw new Error("Failed to fetch files");
            }
            uploadedFiles = await response.json(); // Update state with fetched files
            console.log("Fetched files:", uploadedFiles); // Debugging line
        } catch (err) {
            errorMessage = err.message; // Display error message in UI
            console.error("Error:", err);
        } finally {
            loading = false; // Stop loading
        }
    }

    async function uploadFile(event) {
        const formData = new FormData();
        const file = event.target.files[0];
        formData.append("file", file);
        formData.append("name", "User"); // Adjust as needed

        try {
            const response = await fetch("http://localhost:5002/upload", {
                method: "POST",
                body: formData,
            });
            if (!response.ok) {
                throw new Error("Failed to upload file");
            }
            const data = await response.json();
            console.log("File uploaded:", data);
        } catch (err) {
            console.error("Error:", err);
        }
    }

    // Fetch files on component mount
    fetchUploadedFiles();
</script>

<div>
    <h1>Upload File to GridFS</h1>
    <input type="text" bind:value={name} placeholder="Enter name" />
    <input type="file" on:change={handleFileChange} />
    <button on:click={uploadFile}>Submit</button>

    <h2>Uploaded Files</h2>
    {#if loading}
        <p>Loading files...</p>
    {:else if errorMessage}
        <p>{errorMessage}</p>
    {:else if uploadedFiles.length > 0}
        <ul>
            {#each uploadedFiles as file}
                <li>
                    <strong>{file.filename}</strong>
                    <br />
                    <small>Uploaded by: {file.metadata.uploadedBy}</small>
                    <br />
                    <small>Uploaded on: {file.uploadDate}</small>
                    <br />
                    <img
                        src={`http://localhost:5002/files/${file.filename}`}
                        alt={file.filename}
                        width="200"
                    />
                </li>
            {/each}
        </ul>
    {:else}
        <p>No files uploaded yet.</p>
    {/if}
</div>

<style>
    div {
        display: flex;
        flex-direction: column;
        gap: 20px;
        max-width: 1000px;
        margin: 40px auto;
        padding: 30px;
        border: 1px solid #e0e0e0;
        border-radius: 10px;
        background-color: #f9f9f9;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }

    h1 {
        font-size: 2rem;
        color: #333;
        text-align: center;
        margin-bottom: 20px;
        font-weight: 600;
    }

    input {
        padding: 12px;
        font-size: 1rem;
        border: 1px solid #ccc;
        border-radius: 5px;
        width: 100%;
        box-sizing: border-box;
        transition: border-color 0.3s ease;
    }

    input:focus {
        border-color: #007bff;
        outline: none;
    }

    button {
        padding: 12px;
        font-size: 1rem;
        background-color: #007bff;
        color: white;
        border: none;
        cursor: pointer;
        border-radius: 5px;
        transition: background-color 0.3s ease;
        width: 100%;
    }

    button:hover {
        background-color: #0056b3;
    }

    h2 {
        font-size: 1.5rem;
        color: #333;
        text-align: center;
        margin-top: 30px;
    }

    ul {
        display: grid;
        grid-template-columns: repeat(3, 1fr); /* 3 items per row */
        gap: 20px; /* space between items */
        list-style-type: none;
        padding: 0;
        margin-top: 20px;
    }

    li {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px;
        background-color: #fff;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        transition:
            transform 0.3s ease,
            box-shadow 0.3s ease;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    }

    li:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
    }

    img {
        max-width: 100%;
        height: auto;
        border-radius: 5px;
        margin-top: 15px;
    }

    small {
        color: #777;
        font-size: 0.875rem;
    }

    @media (max-width: 768px) {
        ul {
            grid-template-columns: 1fr 1fr; /* 2 items per row on medium screens */
        }
    }

    @media (max-width: 480px) {
        ul {
            grid-template-columns: 1fr; /* 1 item per row on small screens */
        }
    }
</style>
