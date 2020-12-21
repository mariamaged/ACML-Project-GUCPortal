const express = require('express')
const app = express();
app.use(express.json());

const UserAuthorizationRoutes = require('./Routes/UserAuthorization.js');
const HRRoutes=require('./Routes/HRroute.js');

//app.use('/login', UserAuthorizationRoutes);
app.use('/addLocation',HRRoutes);
module.exports.app = app;