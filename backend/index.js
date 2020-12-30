// For environmental variables.
require('dotenv').config();

// For database instance.
const mongoose = require('mongoose');

// For app singleton instance.
const {app} = require('./app.js');

// Database connection parameters.
const databaseParameters = { useNewUrlParser: true, useUnifiedTopology: true };
mongoose.connect(process.env.DB_URL, databaseParameters)
.then(console.log('Successfully Connected to The Database'));

app.get('/trialEndpoint', async (req, res) => {
    const value = 12;
    return res.status(200).json({value});
});

// Listen on port.
app.listen(process.env.PORT);



























