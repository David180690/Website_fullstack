const express = require('express');
const app = express();
const port = 5000;
const cors = require("cors");

app.use(cors());

app.get('/api', (req, res) => {
    res.send('Hello from Express!');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});