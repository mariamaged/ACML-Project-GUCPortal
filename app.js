const express = require('express')
const app = express();
app.use(express.json());

const UserAuthorizationRoutes = require('./Routes/UserAuthorization.js');

app.use('/login', UserAuthorizationRoutes);
module.exports.app = app;