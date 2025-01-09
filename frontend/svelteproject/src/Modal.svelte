<script>
    export let showModal = false;
    

    let people = [
        { name: "David", age: 25, level: "black", id: 1 },
        { name: "Jane", age: 20, level: "purple", id: 2 },
        { name: "John", age: 55, level: "orange", id: 3 },
        { name: "Sarah", age: 30, level: "yellow", id: 4 },
    ];

    let newName = "";
    let newAge = "";
    let newLevel = "";
    let stupidMessage = "Click a button for no reason!";

    const toggleModal = () => {
        showModal = !showModal; // Fixed incorrect variable reference
        stupidMessage = showModal
            ? "You opened the modal!"
            : "You closed the modal!";
        console.log("Modal toggled");
    };

    const handleClickDelete = (id) => {
        console.log("Deleting person with ID:", id);
        people = people.filter((person) => person.id !== id);
        stupidMessage = `Deleted person with ID ${id}!`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newName || !newAge || !newLevel) {
            alert("Fill out all fields!");
            return;
        }

        const parsedAge = parseInt(newAge);
        if (isNaN(parsedAge) || parsedAge <= 0) {
            alert("Age must be a valid number greater than 0!");
            return;
        }

        const newPerson = {
            name: newName,
            age: parsedAge,
            level: newLevel,
            id: Date.now(),
        };
        people = [...people, newPerson];
        stupidMessage = `Added ${newName} with level ${newLevel}`;
        console.log("Submitting new person:", newPerson);

        try {
            const response = await fetch("http://localhost:5000/api/people", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newPerson),
            });
            if (!response.ok) throw new Error("Failed to submit to server");
            const result = await response.json();
            console.log("Server response:", result);
        } catch (error) {
            console.error("Error submitting to server:", error);
        }

        // Reset inputs and close modal
        newName = newAge = newLevel = "";
        toggleModal();
    };
</script>
