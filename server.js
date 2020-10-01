const express = require("express");
const dotenv = require("dotenv");

//Load Env Vars
dotenv.config({ path: "./config/config.env" });

const app = express();

app.get('/', (req, res) => {
    res.send('Hello from Express');
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port http://localhost:${PORT}`));