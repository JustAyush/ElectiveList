const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();

 const {getHomePage} = require('./routes/index');
 const {addPlayerPage, addCourse, deletePlayer, editPlayer, editPlayerPage,
        getStudentList, addStudentPage, addStudent, editStudentPage, editStudent,
        addInstructor, addInstructorPage} = require('./routes/player');
const port = 5000;

// create connection to database
// the mysql.createConnection function takes in a configuration object which contains host, user, password and the database name.
const db = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'elective2',
    multipleStatements: true
});

// connect to database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});
global.db = db;

// configure middleware
app.set('port', process.env.port || port); // set express to use this port
app.set('views', __dirname + '/views'); // set express to look in this folder to render our view
app.set('view engine', 'ejs'); // configure template engine
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client
app.use(express.static(path.join(__dirname, 'public'))); // configure express to use public folder
app.use(fileUpload()); // configure fileupload

// routes for the app

//routes of Course
app.get('/', getHomePage);
app.get('/add', addPlayerPage);
app.get('/edit/:id', editPlayerPage);
app.get('/delete/:id', deletePlayer);
app.post('/add', addCourse);
app.post('/edit/:id', editPlayer);

// routes for Student
app.get('/student/:id', getStudentList);
app.get('/:id/student/add', addStudentPage);
app.post('/:id/student/add', addStudent);
app.get('/:id/student/edit/:id2', editStudentPage);
app.post('/:id/student/edit/:id2', editStudent);

//routes for instructor_name
app.get('/addInstructor', addInstructorPage);
app.post('/addInstructor', addInstructor);



// set the app to listen on the port
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
