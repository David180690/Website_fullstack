<script>
    let username = "";
    let password = "";
    let message = "";
    let isAuthenticated = false;
  
    
    async function register() {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
  
      if (response.ok) {
        message = "Registration successful! Please log in.";
      } else {
        const errorData = await response.json();
        message = errorData.error || "Registration failed!";
      }
    }
  
    async function login() {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
  
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("authToken", data.token); // Store token
        isAuthenticated = true;
        message = "Login successful! Welcome.";
      } else {
        const errorData = await response.json();
        message = errorData.error || "Login failed!";
      }
    }
  </script>
  
  <main>
    {#if !isAuthenticated}
      <h1>Welcome to the App</h1>
      <p>Please register or log in to continue.</p>
  
      <div>
        <label>
          Username: 
          <input type="text" bind:value={username} />
        </label>
      </div>
      <div>
        <label>
          Password: 
          <input type="password" bind:value={password} />
        </label>
      </div>
      <div>
        <button on:click={register}>Register</button>
        <button on:click={login}>Login</button>
      </div>
      <p>{message}</p>
    {:else}
      <h1>Welcome, {username}!</h1>
      <p>You are logged in and can access the rest of the app.</p>
    {/if}
  </main>
  
  <style>
    main {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  
    div {
      margin: 10px 0;
    }
  
    input {
      margin-left: 10px;
    }
  
    button {
      margin: 5px;
      padding: 10px 20px;
      border: none;
      background: #007bff;
      color: white;
      border-radius: 5px;
      cursor: pointer;
    }
  
    button:hover {
      background: #0056b3;
    }
  </style>
  