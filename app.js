const csv = require('fast-csv')
const multer = require('multer');
const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();
const fs = require('fs');

const {getHomePage, postHomePage, getStudentListFromHome, getElectiveList} = require('./routes/index');
const {
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


app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap



// this is done for importing the csv file to populate the student table
global.__basedir = __dirname;

// -> Multer Upload Storage
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
	   cb(null, __basedir + '/uploads/')
	},
	filename: (req, file, cb) => {
	   cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
	}
});

const upload = multer({storage: storage});

// -> Express Upload RestAPIs
app.post('/api/uploadfile', upload.single("uploadfile"), (req, res) =>{


  try{
    importCsvData2MySQL(__basedir + '/uploads/' + req.file.filename);
  } catch (e) {
    let year_query = "SELECT DISTINCT year FROM `student`"; // query database to get all the player

    // execute query
    db.query(year_query, (err, result) => {
        if (err) {
            res.redirect('/');
        }

        let year = [];
        result.forEach((index) => {
          year.push(index.year);
        })

        res.render('index.ejs', {
            title: 'Elective List',
            year: year,
            message: "The file was not received.",
            courses: []
        });
    });
  }

  let year_query = "SELECT DISTINCT year FROM `student`"; // query database to get all the player

  // execute query
  db.query(year_query, (err, result) => {
      if (err) {
          res.redirect('/');
      }

      let year = [];
      result.forEach((index) => {
        year.push(index.year);
      })

      res.render('index.ejs', {
          title: 'Elective List',
          year: year,
          message: "CSV file has been imported successfully. Go check Student List",
          courses: []
      });
  });

	// res.json({
	// 			'msg': 'File uploaded/import successfully!', 'file': req.file
	// 		});
});


// -> Import CSV File to MySQL database
function importCsvData2MySQL(filePath){
    let stream = fs.createReadStream(filePath);
    let csvData = [];
    let csvStream = csv
        .parse()
        .on("data", function (data) {
            csvData.push(data);
        })
        .on("end", function () {
            // Remove Header ROW
            csvData.shift();

             console.log(csvData);
            // Open the MySQL connection


            let query = 'INSERT IGNORE INTO student (year, sec, stu_id,first_name, last_name) VALUES ?';
            db.query(query, [csvData], (error, response) => {
                console.log(error || response);
            });

			// delete file after saving to MySQL database
			// -> you can comment the statement to see the uploaded CSV file.
			fs.unlinkSync(filePath)
        });

    stream.pipe(csvStream);
}



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
