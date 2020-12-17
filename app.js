require('dotenv').config();
const express = require('express')
const app = express();
app.use(express.json());
const tokenverification = require('./Routes/tokenverification.js');
app.use(tokenverification);

// Routes Imports.
const UserAuthorizationRoutes = require('./Routes/UserAuthorization.js');
const UserAuthorizationRoutes = require('./Routes/HODRoutes.js');

// app.use().
app.use('/login', UserAuthorizationRoutes);
app.use('/CourseInstructorforCourse', HODRoutes);
// Exporting the app.
module.exports.app = app;