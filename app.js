// Routes Imports.
const UserAuthorizationRoutes = require('./Routes/UserAuthorization.js');
const HODRoutes = require('./Routes/HODRoutes.js');

const express = require('express');
const app = express();
app.use(express.json());
//const tokenverification = require('./Routes/tokenverification.js');
//app.use(tokenverification);

// app.use().
app.use('/login', UserAuthorizationRoutes);
//app.use('/CourseInstructorforCourse', HODRoutes);
//app.use('/viewStaffinDepartment', HODRoutes);

// Exporting the app.
module.exports.app = app;