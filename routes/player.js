const fs = require('fs');

module.exports = {

    // for courses
    addPlayerPage: (req, res) => {
        res.render('add-player.ejs', {
            title: 'Elective List',
            message: ''
        });
    },

    addCourse: (req, res) => {
        // if (!req.files) {
        //     return res.status(400).send("No files were uploaded.");
        // }

        let message = '';

        let course_name = req.body.course_name;

        if(course_name == 'DBMS'){
          course_id = 100;
        } else if(course_name == 'EADD') {
          course_id = 200;
        } else if(course_name == 'AI') {
          course_id = 300;
        } else {
          course_id = 400;
        }

        let coursetitleQuery = "SELECT * FROM `course` WHERE title = '" + course_name + "'";

        db.query(coursetitleQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (result.length > 0) {
                message = 'Course already exists';
                res.render('add-player.ejs', {
                    message,
                    title:'ELective List'
                });
            } else {

              let query = "INSERT INTO `course` (course_id, title) VALUES ('" +
                  course_id + "', '" + course_name + "')";
              db.query(query, (err, result) => {
                  if (err) {
                      return res.status(500).send(err);
                  }
                  res.redirect('/');
              });
            }

        });
    },


    editPlayerPage: (req, res) => {

        let courseId = req.params.id;

        let query = "SELECT * FROM `course` WHERE course_id = '" + courseId + "' ";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }

            res.render('edit-player.ejs', {
                title: 'Edit Course'
                ,course: result[0]
                ,message: ''
            });
        });
    },
    editPlayer: (req, res) => {
        // let courseId = req.params.course_id;

        let course_name = req.body.updated_course_name;

        if(course_name == 'DBMS'){
          course_id = 100;
        } else if(course_name == 'EADD') {
          course_id = 200;
        } else if(course_name == 'AI') {
          course_id = 300;
        } else {
          course_id = 400;
        }

        let query = "UPDATE `course` SET `title` = '" + course_name + "', `course_id` = '" + course_id + "'";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
        });
    },

    deletePlayer: (req, res) => {

        let courseId = req.params.id;
        let deleteUserQuery = 'DELETE FROM course WHERE course_id = "' + courseId + '"';

        db.query(deleteUserQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
        });

    },

    // for students

    getStudentList: (req, res) => {

      let courseId = req.params.id;

      let query = 'SELECT student.name, student.stu_id, takes.sec_id, takes.semester, takes.year FROM `student` ' +
                  'INNER JOIN `takes` ' +
                  'ON student.stu_id = takes.id ' +
                  'WHERE takes.course_id = "' + courseId + '" ' +
                  'ORDER BY student.name ASC';  // query database to get all the players

      // execute query
      db.query(query, (err, result) => {
          if (err) {
              res.redirect('/');
          }
          console.log(result);

          res.render('studentList.ejs', {
              title: 'Elective List',
              students: result,
              course_id: courseId
          });
      });

    },

    addStudentPage: (req, res) => {
        res.render('addStudent.ejs', {
            title: 'Elective List',
            message: ''
        });
    },

    addStudent: (req, res) => {
      let courseId = req.params.id;

      console.log('-----------------------------');
      console.log(courseId);

      let message = '';

      let name = req.body.name;
      let rollno = req.body.rollno;
      let section = req.body.section;
      let year = req.body.year;
      let semester = req.body.semester;

      if(courseId == 100){
        ele_id = 2;
      } else if(courseId = 200) {
        ele_id = 3;
      } else if(courseId = 200) {
        ele_id = 2;
      } else {
        ele_id = 3;
      }

      let addStudentQuery = "SELECT * FROM `student` WHERE stu_id = '" + rollno + "'";

      db.query(addStudentQuery, (err, result) => {
          if (err) {
              return res.status(500).send(err);
          }
          if (result.length > 0) {
              message = 'Student already exists';
              res.render('addStudent.ejs', {
                  message,
                  title:'ELective List'
              });
          } else {

            //var pool = mysql.createPool(credentials);

            let query2 ="INSERT INTO `takes` (id, course_id, sec_id, semester, year, ele_id) VALUES ('" +
             rollno + "', '" + courseId + "','" + section + "','" + semester + "','" + year + "','" + ele_id + "')"; 
            "INSERT INTO `student` (stu_id, name, sec_id, year) VALUES ('" +
                rollno + "', '" + name + "','" + section + "','" + year + "')";
               ;


            db.query(query2, (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }
                res.redirect('/');
            });
          }

      });


    }


};
