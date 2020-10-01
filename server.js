const express = require("express");
const dotenv = require("dotenv");

//Load Env Vars
dotenv.config({ path: "./config/config.env" });

const app = express();

app.get('/api/v1/bootcamps', (req, res) => {
    res.status(200).json({success: true, msg: 'Show All Bootcamps'})
})
app.post('/api/v1/bootcamps', (req, res) => {
    res.status(200).json({success: true, msg: 'Create New Bootcamp'})
})
app.get('/api/v1/bootcamps/:id', (req, res) => {
    res.status(200).json({success: true, msg: `Diaplay Bootcamp ${req.params.id}`})
})
app.put('/api/v1/bootcamps/:id', (req, res) => {
    res.status(200).json({success: true, msg: `Update Bootcamp ${req.params.id}`})
})
app.delete('/api/v1/bootcamps/:id', (req, res) => {
    res.status(200).json({success: true, msg: `Delete Bootcamp ${req.params.id}`})
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port http://localhost:${PORT}`));