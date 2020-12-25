const express = require('express')
const app = express();
const HRroutes= require('./Routes/HRroute');
const instructorRoutes= require('./Routes/instructorRoutes.js');
app.use(express.json());
var bodyParser = require('body-parser');
app.use(bodyParser.json());
const UserAuthorizationRoutes = require('./Routes/UserAuthorization.js');
app.listen(3000);

app.use('/HR',HRroutes);
app.use('/Instructor',instructorRoutes);
module.exports.app = app;
