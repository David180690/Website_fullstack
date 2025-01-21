<script>
    export let name = '';
    export let file = null;
    let uploadedFiles = [];
    let loading = false; // To manage loading state
    let errorMessage = ''; // To display any error message

    const handleFileChange = (event) => {
        file = event.target.files[0];
    };

    const uploadFile = async () => {
        if (!name || !file) {
            alert('Please provide a name and select a file!');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:5001/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload file');
            }

            const data = await response.json();
            alert('File uploaded successfully!');
            console.log(data);
            fetchUploadedFiles(); // Fetch the updated list of uploaded files
        } catch (error) {
            console.error(error);
            alert('Failed to upload the file.');
        }
    };

    const fetchUploadedFiles = async () => {
        loading = true;  // Show loading state
        errorMessage = ''; // Clear previous errors

        try {
            const response = await fetch('http://localhost:5001/files');
            if (!response.ok) {
                throw new Error('Failed to fetch files');
            }

            const data = await response.json();
            uploadedFiles = data; // Update the uploaded files list
        } catch (error) {
            console.error(error);
            errorMessage = 'Error fetching files. Please try again later.'; // Display error message
        } finally {
            loading = false; // Hide loading state
        }
    };

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
                    <small>Uploaded on: {new Date(file.uploadDate).toLocaleString()}</small>
                    <br />
                    <!-- Display the image -->
                    <img src={`http://localhost:5001/files/${file.filename}`} alt={file.filename} width="200" />
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
        gap: 10px;
        max-width: 300px;
        margin: auto;
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 5px;
    }

    input {
        padding: 5px;
        font-size: 1rem;
    }

    button {
        padding: 10px;
        font-size: 1rem;
        background-color: #007bff;
        color: white;
        border: none;
        cursor: pointer;
        border-radius: 5px;
    }

    button:hover {
        background-color: #0056b3;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        margin: 5px 0;
    }

    img {
        max-width: 100%;
        margin-top: 10px;
    }
</style>
