// Routes Imports.
const HODRoutes = require('./Routes/HODRoutes.js');

const express = require('express');
const app = express();
app.use(express.json());

// app.use().
app.use('/HOD', HODRoutes);

// Exporting the app.
module.exports.app = app;