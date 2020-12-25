const express = require('express')
const app = express();
const HRroutes= require('./Routes/HRroute');
const instructorRoutes= require('./Routes/instructorRoutes');
app.use(express.json());

const UserAuthorizationRoutes = require('./Routes/UserAuthorization.js');


app.use('/HR',HRroutes);
app.use('/Instructor',instructorRoutes);
module.exports.app = app;