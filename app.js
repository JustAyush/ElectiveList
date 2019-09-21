const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();

const {getHomePage, postHomePage, getStudentListFromHome, getElectiveList} = require('./routes/index');
const {
      addPlayerPage, addCourse, deletePlayer, editPlayer, editPlayerPage,
      getStudentList, addStudentPage, addStudent, editStudentPage, editStudent, deleteStudent,
      getInstructorList, addInstructor, addInstructorPage, editInstructorPage, editInstructor, deleteInstructor, assignCourse, assignCoursePage, assignCourseList,assignCourseEditPage,assignCourseEdit,assignCourseDelete,
      electiveList,
      getFinalList
      } = require('./routes/player');

const port = 5000;

var flash = require('connect-flash');

// create connection to database
// the mysql.createConnection function takes in a configuration object which contains host, user, password and the database name.
const db = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'elective',
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
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(bodyParser.json()); // parse form data client
app.use(express.static(path.join(__dirname, 'public'))); // configure express to use public folder
app.use(fileUpload()); // configure fileupload

// routes for the app

//routes of Course
// app.get('/', getHomePage);
// app.get('/add', addPlayerPage);
// app.get('/edit/:id', editPlayerPage);
// app.get('/delete/:id', deletePlayer);
// app.post('/add', addCourse);
// app.post('/edit/:id', editPlayer);

// route for homepage
app.get('/', getHomePage);
app.post('/', postHomePage);
app.post('/getStudentList', getStudentListFromHome);
app.post('/getElectiveList', getElectiveList);
app.get('/:elec_no/:sec/elective', electiveList);

//routes for assignCourseapp.get('/student/assigncourse/:year/:sec/:id',assignCoursePage);
app.post('/student/assigncourse/:year/:sec/:id',assignCourse);
app.get('/student/assigncourse/:year/:sec/:id',assignCoursePage);
app.get('/:year/:sec/student/assigncourselist',assignCourseList);
app.get('/student/assigncourse/edit/:year/:sec/:id',assignCourseEditPage);
app.post('/student/assigncourse/edit/:year/:sec/:id',assignCourseEdit);
app.get('/student/assigncourse/delete/:year/:sec/:id',assignCourseDelete);

// routes for Student
app.get('/:year/:sec/student/', getStudentList);
app.get('/student/add', addStudentPage);
app.post('/student/add', addStudent);
app.get('/student/edit/:year/:sec/:id', editStudentPage);
app.post('/student/edit/:year/:sec/:id', editStudent);
app.get('/student/delete/:year/:sec/:id', deleteStudent);


//routes for instructor_name
app.get('/instructor/', getInstructorList);
app.get('/instructor/add', addInstructorPage);
app.post('/instructor/add', addInstructor);
app.get('/instructor/edit/:id', editInstructorPage);
app.post('/instructor/edit/:id', editInstructor);
app.get('/instructor/delete/:id', deleteInstructor);

// route for final list
app.get('/finalList/:year/:sec', getFinalList);


// set the app to listen on the port
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
