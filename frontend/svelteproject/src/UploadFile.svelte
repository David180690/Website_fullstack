<script>
    export let name = '';
    export let file = null;

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
        } catch (error) {
            console.error(error);
            alert('Failed to upload the file.');
        }
    };
</script>

<div>
    <h1>Upload File to GridFS</h1>
    <input type="text" bind:value={name} placeholder="Enter name" />
    <input type="file" on:change={handleFileChange} />
    <button on:click={uploadFile}>Submit</button>
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
</style>
